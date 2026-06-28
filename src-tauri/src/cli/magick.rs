use std::path::{Path, PathBuf};

use crate::error::{AppError, AppResult};
use crate::models::{
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

pub fn build_preview_with_tool(
    request: &OperationRequest,
    tool_program: &str,
) -> AppResult<CommandPreview> {
    let first_file = request
        .input_files
        .first()
        .ok_or_else(|| AppError::new("No input file selected."))?;

    build_command_for_file_with_tool(request, first_file, 0, tool_program)
}

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
        }
    }

    args.push("-quality".to_string());
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
        args.push("-strip".to_string());
        return;
    }

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
    }
}
