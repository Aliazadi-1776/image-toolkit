use std::path::{Path, PathBuf};

use crate::error::{AppError, AppResult};
use crate::models::{
    CommandPreview, CompressionMode, CropOptions, CropUnit, FileProcessingOptions, ImageFile,
    OperationRequest, ResizeMode, ResizeOptions, TargetFormat,
};

pub fn build_preview_with_tool(
    request: &OperationRequest,
    tool_program: &str,
) -> AppResult<CommandPreview> {
    let Some(first_file) = request.input_files.first() else {
        return Err(AppError::new("No input files selected."));
    };

    build_command_for_file_with_tool(request, first_file, 0, tool_program)
}

pub fn build_command_for_file_with_tool(
    request: &OperationRequest,
    file: &ImageFile,
    index: usize,
    tool_program: &str,
) -> AppResult<CommandPreview> {
    let processing = processing_for_file(request, file);
    let output = output_path_for(request, &file.path, index, processing.target_format)?;

    let mut args = Vec::new();

    args.push(file.path.clone());

    if let Some((x, y, width, height)) = crop_geometry_for_file(request, file) {
        args.push("-crop".to_string());
        args.push(format!("{width}x{height}+{x}+{y}"));
        args.push("+repage".to_string());
    }

    if processing.resize.enabled {
        let geometry = resize_geometry(processing.resize);

        match processing.resize.mode {
            ResizeMode::Fit => {
                args.push("-resize".to_string());
                args.push(geometry);
            }
            ResizeMode::Fill => {
                args.push("-resize".to_string());
                args.push(format!("{geometry}^"));
                args.push("-gravity".to_string());
                args.push("center".to_string());
                args.push("-extent".to_string());
                args.push(geometry);
            }
            ResizeMode::Stretch => {
                args.push("-resize".to_string());
                args.push(format!("{geometry}!"));
            }
        }
    }

    if *processing.compression == CompressionMode::Lossless {
        match processing.target_format {
            TargetFormat::Webp => {
                args.push("-define".to_string());
                args.push("webp:lossless=true".to_string());
            }
            TargetFormat::Png => {
                args.push("-define".to_string());
                args.push("png:compression-level=9".to_string());
            }
            _ => {}
        }
    }

    args.push("-quality".to_string());
    args.push(processing.quality.to_string());

    append_metadata_strip_args(request, &mut args);

    args.push(output.clone());

    let command_line = shell_join(tool_program, &args);

    Ok(CommandPreview {
        tool: tool_program.to_string(),
        args,
        command_line,
    })
}

struct ProcessingRef<'a> {
    target_format: &'a TargetFormat,
    quality: u8,
    compression: &'a CompressionMode,
    resize: &'a ResizeOptions,
}

fn processing_for_file<'a>(request: &'a OperationRequest, file: &ImageFile) -> ProcessingRef<'a> {
    if let Some(options) = request.per_file_options.get(&file.path) {
        return processing_from_file_options(options);
    }

    ProcessingRef {
        target_format: &request.target_format,
        quality: request.quality,
        compression: &request.compression,
        resize: &request.resize,
    }
}

fn processing_from_file_options(options: &FileProcessingOptions) -> ProcessingRef<'_> {
    ProcessingRef {
        target_format: &options.target_format,
        quality: options.quality,
        compression: &options.compression,
        resize: &options.resize,
    }
}

fn crop_for_file<'a>(request: &'a OperationRequest, file: &ImageFile) -> &'a CropOptions {
    request.per_file_crops.get(&file.path).unwrap_or(&request.crop)
}

fn crop_geometry_for_file(request: &OperationRequest, file: &ImageFile) -> Option<(u32, u32, u32, u32)> {
    let crop = crop_for_file(request, file);

    if !crop.enabled {
        return None;
    }

    match crop.unit {
        CropUnit::Pixels => {
            if crop.width == 0 || crop.height == 0 {
                return None;
            }
            Some((crop.x, crop.y, crop.width, crop.height))
        }
        CropUnit::Percent => {
            let image_width = file.width?;
            let image_height = file.height?;

            let x = (crop.relative_x * image_width as f64).round().max(0.0) as u32;
            let y = (crop.relative_y * image_height as f64).round().max(0.0) as u32;

            let mut width = (crop.relative_width * image_width as f64).round().max(1.0) as u32;
            let mut height = (crop.relative_height * image_height as f64).round().max(1.0) as u32;

            if x + width > image_width {
                width = image_width.saturating_sub(x).max(1);
            }
            if y + height > image_height {
                height = image_height.saturating_sub(y).max(1);
            }

            Some((x, y, width, height))
        }
    }
}

fn resize_geometry(resize: &ResizeOptions) -> String {
    match (resize.width, resize.height) {
        (Some(width), Some(height)) => format!("{width}x{height}"),
        (Some(width), None) => format!("{width}x"),
        (None, Some(height)) => format!("x{height}"),
        (None, None) => "100%".to_string(),
    }
}

fn append_metadata_strip_args(request: &OperationRequest, args: &mut Vec<String>) {
    if request.metadata.strip_all {
        args.push("-strip".to_string());
        return;
    }

    if request.metadata.strip_exif {
        args.push("-define".to_string());
        args.push("profile:skip=EXIF".to_string());
    }
    if request.metadata.strip_xmp {
        args.push("-define".to_string());
        args.push("profile:skip=XMP".to_string());
    }
    if request.metadata.strip_icc {
        args.push("-define".to_string());
        args.push("profile:skip=ICC".to_string());
    }
    if request.metadata.strip_gps || request.metadata.strip_camera_info {
        args.push("-strip".to_string());
    }
}

fn output_path_for(
    request: &OperationRequest,
    input: &str,
    index: usize,
    target_format: &TargetFormat,
) -> AppResult<String> {
    if request.output.overwrite {
        return Ok(input.to_string());
    }

    let input_path = Path::new(input);
    let stem = input_path
        .file_stem()
        .and_then(|value| value.to_str())
        .ok_or_else(|| AppError::new("Invalid input file name."))?;

    let extension = extension_for(target_format);

    let file_name = if index == 0 {
        format!("{stem}.{extension}")
    } else {
        format!("{stem}-{index}.{extension}")
    };

    let directory = if request.output.use_source_directory {
        input_path.parent().map(Path::to_path_buf).unwrap_or_else(|| PathBuf::from("."))
    } else {
        request.output.directory.as_ref().map(PathBuf::from).unwrap_or_else(|| {
            input_path.parent().map(Path::to_path_buf).unwrap_or_else(|| PathBuf::from("."))
        })
    };

    Ok(directory.join(file_name).to_string_lossy().to_string())
}

fn extension_for(format: &TargetFormat) -> &'static str {
    match format {
        TargetFormat::Webp => "webp",
        TargetFormat::Avif => "avif",
        TargetFormat::Png => "png",
        TargetFormat::Jpeg => "jpg",
        TargetFormat::Tiff => "tiff",
        TargetFormat::Bmp => "bmp",
        TargetFormat::Gif => "gif",
        TargetFormat::Ico => "ico",
    }
}

pub fn shell_join(tool: &str, args: &[String]) -> String {
    std::iter::once(tool.to_string())
        .chain(args.iter().map(|arg| shell_escape(arg)))
        .collect::<Vec<_>>()
        .join(" ")
}

fn shell_escape(value: &str) -> String {
    if value.chars().all(|character| character.is_ascii_alphanumeric() || "-_./:@".contains(character)) {
        value.to_string()
    } else {
        format!("'{}'", value.replace('\'', "'\\''"))
    }
}
