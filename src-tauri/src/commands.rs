use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::thread;
use std::time::Duration;

use tauri::{AppHandle, Emitter};

use crate::cli::magick;
use crate::error::{AppError, AppResult};
use crate::models::{
    CommandPreview, ImageFile, OperationRequest, QueueFinishedEvent, QueueItemFinishedEvent,
    QueueProgressEvent, QueueStartResult, QueueStartedEvent, RunLogEntry,
};
use crate::tools::{resolve_tool, ResolvedTool, ToolKind};

#[tauri::command]
pub fn health_check() -> &'static str {
    "Image Toolkit backend is ready."
}

#[tauri::command]
pub fn preview_command(app: AppHandle, request: OperationRequest) -> AppResult<CommandPreview> {
    let tool = resolve_tool(&app, ToolKind::Magick, &request.tools.magick);
    magick::build_preview_with_tool(&request, &tool.program)
}

#[tauri::command]
pub fn resolve_input_paths(paths: Vec<String>) -> AppResult<Vec<ImageFile>> {
    let mut files = Vec::new();

    for raw_path in paths {
        let path = PathBuf::from(raw_path);

        if path.is_file() {
            if is_supported_image(&path) {
                files.push(path_to_image_file(&path)?);
            }
        } else if path.is_dir() {
            collect_images_from_folder(&path, &mut files)?;
        }
    }

    files.sort_by(|a, b| a.path.cmp(&b.path));
    files.dedup_by(|a, b| a.path == b.path);

    Ok(files)
}

#[tauri::command]
pub fn start_queue(app: AppHandle, request: OperationRequest) -> AppResult<QueueStartResult> {
    if request.input_files.is_empty() {
        return Err(AppError::new("No input files selected."));
    }

    let total = request.input_files.len();

    thread::spawn(move || {
        run_queue_job(app, request);
    });

    Ok(QueueStartResult {
        accepted: true,
        total,
    })
}

fn run_queue_job(app: AppHandle, request: OperationRequest) {
    let total = request.input_files.len();
    let mut completed = 0usize;
    let mut failed = 0usize;
    let magick_tool = resolve_tool(&app, ToolKind::Magick, &request.tools.magick);

    let _ = app.emit("queue-started", QueueStartedEvent { total });

    for (index, input_file) in request.input_files.iter().enumerate() {
        let _ = app.emit(
            "queue-progress",
            QueueProgressEvent {
                index,
                total,
                input_path: input_file.path.clone(),
                file_name: input_file.file_name.clone(),
                status: "processing".to_string(),
                completed,
                failed,
            },
        );

        let entry = process_single_file(&request, input_file, index, &magick_tool);

        if entry.status == "completed" {
            completed += 1;
        } else {
            failed += 1;
        }

        let _ = app.emit(
            "queue-item-finished",
            QueueItemFinishedEvent {
                index,
                total,
                entry,
                completed,
                failed,
            },
        );

        thread::sleep(Duration::from_millis(80));
    }

    let _ = app.emit(
        "queue-finished",
        QueueFinishedEvent {
            total,
            completed,
            failed,
        },
    );
}

fn process_single_file(
    request: &OperationRequest,
    input_file: &ImageFile,
    index: usize,
    magick_tool: &ResolvedTool,
) -> RunLogEntry {
    let preview =
        match magick::build_command_for_file_with_tool(request, input_file, index, &magick_tool.program)
        {
            Ok(value) => value,
            Err(error) => {
                return RunLogEntry {
                    input_path: input_file.path.clone(),
                    output_path: String::new(),
                    command: String::new(),
                    status: "failed".to_string(),
                    stdout: String::new(),
                    stderr: String::new(),
                    error: Some(error.message),
                };
            }
        };

    let output_path = PathBuf::from(&preview.output_path);

    if output_path.exists() && !request.output.overwrite {
        return RunLogEntry {
            input_path: input_file.path.clone(),
            output_path: preview.output_path.clone(),
            command: preview.command.clone(),
            status: "failed".to_string(),
            stdout: String::new(),
            stderr: String::new(),
            error: Some(
                "Output file already exists. Enable overwrite or change naming.".to_string(),
            ),
        };
    }

    if let Some(parent) = output_path.parent() {
        if !parent.exists() {
            if request.output.create_output_folder {
                if let Err(error) = fs::create_dir_all(parent) {
                    return RunLogEntry {
                        input_path: input_file.path.clone(),
                        output_path: preview.output_path.clone(),
                        command: preview.command.clone(),
                        status: "failed".to_string(),
                        stdout: String::new(),
                        stderr: String::new(),
                        error: Some(format!("Failed to create output folder: {}", error)),
                    };
                }
            } else {
                return RunLogEntry {
                    input_path: input_file.path.clone(),
                    output_path: preview.output_path.clone(),
                    command: preview.command.clone(),
                    status: "failed".to_string(),
                    stdout: String::new(),
                    stderr: String::new(),
                    error: Some("Output folder does not exist.".to_string()),
                };
            }
        }
    }

    let output = Command::new(&preview.tool)
        .args(&preview.args)
        .envs(magick_tool.envs.iter().map(|(key, value)| (key, value)))
        .output();

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).to_string();

            if output.status.success() {
                RunLogEntry {
                    input_path: input_file.path.clone(),
                    output_path: preview.output_path.clone(),
                    command: format!("{}  # tool-source: {}", preview.command, magick_tool.source),
                    status: "completed".to_string(),
                    stdout,
                    stderr,
                    error: None,
                }
            } else {
                RunLogEntry {
                    input_path: input_file.path.clone(),
                    output_path: preview.output_path.clone(),
                    command: format!("{}  # tool-source: {}", preview.command, magick_tool.source),
                    status: "failed".to_string(),
                    stdout,
                    stderr,
                    error: Some(format!("Process exited with status: {}", output.status)),
                }
            }
        }
        Err(error) => RunLogEntry {
            input_path: input_file.path.clone(),
            output_path: preview.output_path.clone(),
            command: format!("{}  # tool-source: {}", preview.command, magick_tool.source),
            status: "failed".to_string(),
            stdout: String::new(),
            stderr: String::new(),
            error: Some(format!("Failed to execute command: {}", error)),
        },
    }
}

fn collect_images_from_folder(folder: &Path, files: &mut Vec<ImageFile>) -> AppResult<()> {
    let entries = fs::read_dir(folder)
        .map_err(|error| AppError::new(format!("Failed to read folder: {}", error)))?;

    for entry in entries {
        let entry =
            entry.map_err(|error| AppError::new(format!("Failed to read entry: {}", error)))?;

        let path = entry.path();

        if path.is_file() {
            if is_supported_image(&path) {
                files.push(path_to_image_file(&path)?);
            }
        } else if path.is_dir() {
            collect_images_from_folder(&path, files)?;
        }
    }

    Ok(())
}

fn path_to_image_file(path: &Path) -> AppResult<ImageFile> {
    let file_name = path
        .file_name()
        .and_then(|value| value.to_str())
        .ok_or_else(|| AppError::new("Invalid file name."))?
        .to_string();

    Ok(ImageFile {
        path: path.to_string_lossy().to_string(),
        file_name,
    })
}

fn is_supported_image(path: &Path) -> bool {
    let Some(extension) = path.extension().and_then(|value| value.to_str()) else {
        return false;
    };

    matches!(
        extension.to_ascii_lowercase().as_str(),
        "jpg"
            | "jpeg"
            | "png"
            | "webp"
            | "avif"
            | "tif"
            | "tiff"
            | "bmp"
            | "gif"
            | "ico"
    )
}
