<<<<<<< HEAD
use std::fs; use std::path::{Path,PathBuf}; use std::process::Command; use std::thread; use std::time::Duration; use tauri::{AppHandle,Emitter}; use crate::cli::exiftool; use crate::cli::magick::{build_command_for_file_with_tool,build_preview_with_tool}; use crate::error::{AppError,AppResult}; use crate::models::{CommandPreview,ImageFile,OperationRequest,QueueFinishedEvent,QueueItemFinishedEvent,QueueProgressEvent,QueueStartResult,QueueStartedEvent,RunEntry,RunSummary}; use crate::tools::{resolve_tool,ToolKind};
#[tauri::command] pub fn health_check()->String{"ok".to_string()}
#[tauri::command] pub fn preview_command(request:OperationRequest)->AppResult<CommandPreview>{ let magick=resolve_tool(ToolKind::Magick,&request.tools.magick); let mut preview=build_preview_with_tool(&request,&magick.program)?; preview.command_line=format!("{}\n# tool-source: {}",preview.command_line,magick.source); if exiftool::has_write_metadata(&request.write_metadata){ let output=preview.args.last().cloned().unwrap_or_default(); let exif=resolve_tool(ToolKind::Exiftool,&request.tools.exiftool); let args=exiftool::build_write_args(&request.write_metadata,&output); preview.command_line=format!("{}\n{}\n# exiftool-source: {}",preview.command_line,exiftool::shell_join(&exif.program,&args),exif.source); } Ok(preview) }
#[tauri::command] pub fn resolve_input_paths(paths:Vec<String>)->AppResult<Vec<ImageFile>>{ let magick=resolve_tool(ToolKind::Magick,"magick"); let mut files=Vec::new(); for path in paths{ let p=PathBuf::from(path); if p.is_dir(){collect_images_from_dir(&p,&mut files,&magick.program)?;}else if is_supported_image(&p){files.push(image_file_from_path(&p,&magick.program)?);} } Ok(files) }
#[tauri::command] pub fn start_queue(app:AppHandle,request:OperationRequest)->AppResult<QueueStartResult>{ if request.input_files.is_empty(){return Err(AppError::new("No input files selected."));} let total=request.input_files.len(); thread::spawn(move||run_queue_job(app,request)); Ok(QueueStartResult{accepted:true,total}) }
fn run_queue_job(app:AppHandle,request:OperationRequest){ let total=request.input_files.len(); let _=app.emit("queue-started",QueueStartedEvent{total}); let magick=resolve_tool(ToolKind::Magick,&request.tools.magick); let exif=resolve_tool(ToolKind::Exiftool,&request.tools.exiftool); let mut entries=Vec::new(); for (index,file) in request.input_files.iter().enumerate(){ let _=app.emit("queue-progress",QueueProgressEvent{current_index:index+1,total,input:file.path.clone()}); let entry=process_single_file(&request,file,index,&magick.program,&magick.source,&exif.program,&exif.source); let _=app.emit("queue-item-finished",QueueItemFinishedEvent{entry:entry.clone()}); entries.push(entry); thread::sleep(Duration::from_millis(80)); } let succeeded=entries.iter().filter(|e|e.success).count(); let failed=entries.len().saturating_sub(succeeded); let summary=RunSummary{total,succeeded,failed,entries}; let _=app.emit("queue-finished",QueueFinishedEvent{summary}); }
fn process_single_file(req:&OperationRequest,file:&ImageFile,index:usize,magick_program:&str,magick_source:&str,exif_program:&str,exif_source:&str)->RunEntry{ let preview=match build_command_for_file_with_tool(req,file,index,magick_program){Ok(p)=>p,Err(e)=>return RunEntry{input:file.path.clone(),output:String::new(),command_line:format!("failed to build command: {}",e.message),success:false,stderr:e.message,stdout:String::new()}}; let output=preview.args.last().cloned().unwrap_or_default(); let mut command_line=format!("{}\n# magick-source: {}",preview.command_line,magick_source); let mut stdout=String::new(); let mut stderr=String::new(); match Command::new(&preview.tool).args(&preview.args).output(){Ok(r)=>{stdout.push_str(&String::from_utf8_lossy(&r.stdout));stderr.push_str(&String::from_utf8_lossy(&r.stderr)); if !r.status.success(){return RunEntry{input:file.path.clone(),output,command_line,success:false,stdout,stderr};}},Err(e)=>return RunEntry{input:file.path.clone(),output,command_line,success:false,stdout,stderr:e.to_string()}} if exiftool::has_write_metadata(&req.write_metadata){ let args=exiftool::build_write_args(&req.write_metadata,&output); let exif_line=exiftool::shell_join(exif_program,&args); command_line=format!("{command_line}\n{exif_line}\n# exiftool-source: {exif_source}"); match Command::new(exif_program).args(&args).output(){Ok(r)=>{stdout.push_str(&String::from_utf8_lossy(&r.stdout));stderr.push_str(&String::from_utf8_lossy(&r.stderr)); if !r.status.success(){return RunEntry{input:file.path.clone(),output,command_line,success:false,stdout,stderr};}},Err(e)=>return RunEntry{input:file.path.clone(),output,command_line,success:false,stdout,stderr:e.to_string()}} } RunEntry{input:file.path.clone(),output,command_line,success:true,stdout,stderr} }
fn collect_images_from_dir(dir:&Path,files:&mut Vec<ImageFile>,magick:&str)->AppResult<()> { let entries=fs::read_dir(dir).map_err(|e|AppError::new(e.to_string()))?; for entry in entries.flatten(){ let path=entry.path(); if path.is_dir(){collect_images_from_dir(&path,files,magick)?;}else if is_supported_image(&path){files.push(image_file_from_path(&path,magick)?);} } Ok(()) }
fn image_file_from_path(path:&Path,magick:&str)->AppResult<ImageFile>{ let meta=fs::metadata(path).map_err(|e|AppError::new(e.to_string()))?; let file_name=path.file_name().and_then(|v|v.to_str()).unwrap_or_default().to_string(); let extension=path.extension().and_then(|v|v.to_str()).unwrap_or_default().to_lowercase(); let (width,height)=read_image_dimensions(path,magick); Ok(ImageFile{path:path.to_string_lossy().to_string(),file_name,extension,size_bytes:meta.len(),width,height}) }
fn read_image_dimensions(path:&Path,magick:&str)->(Option<u32>,Option<u32>){ let ps=path.to_string_lossy().to_string(); let output=if magick.ends_with("magick")||magick.ends_with("magick.exe"){Command::new(magick).args(["identify","-format","%w %h",ps.as_str()]).output()}else{Command::new("identify").args(["-format","%w %h",ps.as_str()]).output()}; let Ok(output)=output else{return(None,None)}; if !output.status.success(){return(None,None)} let s=String::from_utf8_lossy(&output.stdout); let mut parts=s.split_whitespace(); (parts.next().and_then(|v|v.parse::<u32>().ok()),parts.next().and_then(|v|v.parse::<u32>().ok())) }
fn is_supported_image(path:&Path)->bool{ let Some(ext)=path.extension().and_then(|v|v.to_str()) else{return false}; matches!(ext.to_lowercase().as_str(),"jpg"|"jpeg"|"png"|"webp"|"avif"|"tif"|"tiff"|"bmp"|"gif"|"ico") }
=======
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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
