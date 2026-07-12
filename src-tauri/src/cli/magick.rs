use std::path::{Path, PathBuf};

use crate::error::{AppError, AppResult};
use crate::models::{
<<<<<<< HEAD
    CommandPreview, CompressionMode, CropOptions, CropUnit, FileProcessingOptions, ImageFile,
    OperationRequest, ResizeMode, ResizeOptions, TargetFormat,
};

=======
    ColorProfile, CommandPreview, CompressionMode, ImageFile, NamingMode, OperationRequest,
    OutputMode, ResizeMode,
};

pub fn build_preview(request: &OperationRequest) -> AppResult<CommandPreview> {
    let first_file = request
        .input_files
        .first()
        .ok_or_else(|| AppError::new("No input file selected."))?;

    build_command_for_file_with_tool(request, first_file, 0, &request.tools.magick)
}

>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
pub fn build_preview_with_tool(
    request: &OperationRequest,
    tool_program: &str,
) -> AppResult<CommandPreview> {
<<<<<<< HEAD
    let Some(first_file) = request.input_files.first() else {
        return Err(AppError::new("No input files selected."));
    };
=======
    let first_file = request
        .input_files
        .first()
        .ok_or_else(|| AppError::new("No input file selected."))?;
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76

    build_command_for_file_with_tool(request, first_file, 0, tool_program)
}

<<<<<<< HEAD
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
=======
pub fn build_command_for_file(
    request: &OperationRequest,
    input_file: &ImageFile,
    index: usize,
) -> AppResult<CommandPreview> {
    build_command_for_file_with_tool(request, input_file, index, &request.tools.magick)
}

pub fn build_command_for_file_with_tool(
    request: &OperationRequest,
    input_file: &ImageFile,
    index: usize,
    tool_program: &str,
) -> AppResult<CommandPreview> {
    let input_path = PathBuf::from(&input_file.path);
    let output_path = build_output_path(request, &input_path, index)?;

    let mut args: Vec<String> = Vec::new();

    args.push(input_file.path.clone());

    if request.resize.enabled {
        if let Some(geometry) = build_resize_geometry(request) {
            args.push("-resize".to_string());
            args.push(geometry);

            if matches!(request.resize.mode, ResizeMode::Fill) {
                if let (Some(width), Some(height)) = (request.resize.width, request.resize.height) {
                    args.push("-gravity".to_string());
                    args.push("center".to_string());
                    args.push("-extent".to_string());
                    args.push(format!("{}x{}", width, height));
                }
            }
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
        }
    }

    args.push("-quality".to_string());
<<<<<<< HEAD
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
=======
    args.push(request.quality.to_string());

    if matches!(request.compression, CompressionMode::Lossless) {
        args.push("-define".to_string());
        args.push("webp:lossless=true".to_string());
    }

    add_metadata_strip_args(&mut args, request);
    add_metadata_write_args(&mut args, request);

    if request.dpi.enabled {
        if let Some(dpi) = request.dpi.value {
            args.push("-units".to_string());
            args.push("PixelsPerInch".to_string());
            args.push("-density".to_string());
            args.push(dpi.to_string());
        }
    }

    match request.color_profile {
        ColorProfile::KeepOriginal => {}
        ColorProfile::Srgb => {
            args.push("-colorspace".to_string());
            args.push("sRGB".to_string());
        }
        ColorProfile::AdobeRgb => {
            args.push("-colorspace".to_string());
            args.push("sRGB".to_string());
        }
        ColorProfile::DisplayP3 => {
            args.push("-colorspace".to_string());
            args.push("sRGB".to_string());
        }
    }

    args.push(output_path.to_string_lossy().to_string());

    let tool = tool_program.to_string();
    let command = format_command(&tool, &args);

    Ok(CommandPreview {
        tool,
        args,
        command,
        output_path: output_path.to_string_lossy().to_string(),
    })
}

fn build_resize_geometry(request: &OperationRequest) -> Option<String> {
    match (request.resize.width, request.resize.height) {
        (Some(width), Some(height)) => match request.resize.mode {
            ResizeMode::Stretch => Some(format!("{}x{}!", width, height)),
            ResizeMode::Fill => Some(format!("{}x{}^", width, height)),
            ResizeMode::Fit => {
                if request.resize.keep_aspect_ratio {
                    Some(format!("{}x{}", width, height))
                } else {
                    Some(format!("{}x{}!", width, height))
                }
            }
        },
        (Some(width), None) => Some(width.to_string()),
        (None, Some(height)) => Some(format!("x{}", height)),
        (None, None) => None,
    }
}

fn add_metadata_strip_args(args: &mut Vec<String>, request: &OperationRequest) {
    if request.metadata.strip_everything {
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
        args.push("-strip".to_string());
        return;
    }

<<<<<<< HEAD
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
=======
    if request.metadata.strip_exif
        || request.metadata.strip_gps
        || request.metadata.strip_camera_information
    {
        args.push("+profile".to_string());
        args.push("exif".to_string());
    }

    if request.metadata.strip_icc_profile {
        args.push("+profile".to_string());
        args.push("icc".to_string());
    }

    if request.metadata.strip_xmp {
        args.push("+profile".to_string());
        args.push("xmp".to_string());
    }
}

fn add_metadata_write_args(args: &mut Vec<String>, request: &OperationRequest) {
    let fields: [(&str, &Option<String>); 6] = [
        ("copyright", &request.metadata_write.copyright),
        ("author", &request.metadata_write.author),
        ("creator", &request.metadata_write.creator),
        ("description", &request.metadata_write.description),
        ("keywords", &request.metadata_write.keywords),
        ("comment", &request.metadata_write.comment),
    ];

    for (key, value) in fields {
        if let Some(value) = value {
            let trimmed = value.trim();

            if !trimmed.is_empty() {
                args.push("-set".to_string());
                args.push(key.to_string());
                args.push(trimmed.to_string());
            }
        }
    }
}

fn build_output_path(
    request: &OperationRequest,
    input_path: &Path,
    index: usize,
) -> AppResult<PathBuf> {
    let extension = request.target_format.extension();

    let stem = input_path
        .file_stem()
        .and_then(|value| value.to_str())
        .ok_or_else(|| AppError::new("Invalid input filename."))?;

    let output_name = match request.naming.mode {
        NamingMode::KeepOriginal => format!("{}.{}", stem, extension),
        NamingMode::Rename => {
            let name = request.naming.value.as_deref().unwrap_or("output");
            format!("{}.{}", name, extension)
        }
        NamingMode::Prefix => {
            let prefix = request.naming.value.as_deref().unwrap_or("");
            format!("{}{}.{}", prefix, stem, extension)
        }
        NamingMode::Suffix => {
            let suffix = request.naming.value.as_deref().unwrap_or("");
            format!("{}{}.{}", stem, suffix, extension)
        }
        NamingMode::Sequential => {
            let base = request.naming.value.as_deref().unwrap_or(stem);
            let start = request.naming.start_number.unwrap_or(1);
            format!("{}-{:04}.{}", base, start + index as u32, extension)
        }
    };

    let parent = match request.output.mode {
        OutputMode::SameFolder => input_path
            .parent()
            .ok_or_else(|| AppError::new("Input file has no parent folder."))?
            .to_path_buf(),
        OutputMode::CustomFolder => request
            .output
            .custom_folder
            .as_ref()
            .map(PathBuf::from)
            .ok_or_else(|| AppError::new("Custom output folder is not selected."))?,
    };

    Ok(parent.join(output_name))
}

fn format_command(tool: &str, args: &[String]) -> String {
    let mut parts = vec![quote_arg(tool)];

    for arg in args {
        parts.push(quote_arg(arg));
    }

    parts.join(" ")
}

fn quote_arg(value: &str) -> String {
    let needs_quote = value.contains(' ')
        || value.contains('\\')
        || value.contains('(')
        || value.contains(')')
        || value.contains('&');

    if needs_quote {
        format!("\"{}\"", value.replace('"', "\\\""))
    } else {
        value.to_string()
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
    }
}
