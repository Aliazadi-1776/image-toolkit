<<<<<<< HEAD
use std::process::Command; use serde::Serialize; use crate::tools::{resolve_tool, tool_name, version_args, ToolKind};
#[derive(Debug, Clone, Serialize)] #[serde(rename_all="camelCase")] pub struct ToolStatus { pub name:String, pub program:String, pub source:String, pub success:bool, pub stdout:String, pub stderr:String, pub error:Option<String> }
#[tauri::command] pub fn tool_statuses()->Vec<ToolStatus>{ [ToolKind::Magick,ToolKind::Cwebp,ToolKind::Avifenc,ToolKind::Exiftool].into_iter().map(status_for_tool).collect() }
fn status_for_tool(kind:ToolKind)->ToolStatus{ let tool=resolve_tool(kind, default_requested(kind)); match Command::new(&tool.program).args(version_args(kind)).output(){ Ok(output)=>ToolStatus{name:tool_name(kind).to_string(),program:tool.program,source:tool.source,success:output.status.success(),stdout:String::from_utf8_lossy(&output.stdout).to_string(),stderr:String::from_utf8_lossy(&output.stderr).to_string(),error:None}, Err(error)=>ToolStatus{name:tool_name(kind).to_string(),program:tool.program,source:tool.source,success:false,stdout:String::new(),stderr:String::new(),error:Some(error.to_string())} } }
fn default_requested(kind:ToolKind)->&'static str{ match kind{ToolKind::Magick=>"magick",ToolKind::Cwebp=>"cwebp",ToolKind::Avifenc=>"avifenc",ToolKind::Exiftool=>"exiftool"} }
=======
use std::path::Path;
use std::process::Command;

use serde::Serialize;
use tauri::AppHandle;

use crate::models::ToolPaths;
use crate::tools::{resolve_tool, ResolvedTool, ToolKind};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ToolStatus {
    pub name: String,
    pub program: String,
    pub source: String,
    pub exists: bool,
    pub success: bool,
    pub version_command: String,
    pub stdout: String,
    pub stderr: String,
    pub error: Option<String>,
}

#[tauri::command]
pub fn tool_statuses(app: AppHandle, tools: ToolPaths) -> Vec<ToolStatus> {
    vec![
        check_tool(
            &app,
            "ImageMagick",
            ToolKind::Magick,
            &tools.magick,
            &["-version"],
        ),
        check_tool(&app, "cwebp", ToolKind::Cwebp, &tools.cwebp, &["-version"]),
        check_tool(
            &app,
            "avifenc",
            ToolKind::Avifenc,
            &tools.avifenc,
            &["--version"],
        ),
    ]
}

fn check_tool(
    app: &AppHandle,
    name: &str,
    kind: ToolKind,
    fallback: &str,
    version_args: &[&str],
) -> ToolStatus {
    let resolved = resolve_tool(app, kind, fallback);
    let exists = resolved.source != "system" || Path::new(&resolved.program).exists();

    let output = run_version_command(&resolved, version_args);
    let version_command = format!("{} {}", resolved.program, version_args.join(" "));

    match output {
        Ok(output) => ToolStatus {
            name: name.to_string(),
            program: resolved.program,
            source: resolved.source,
            exists,
            success: output.status.success(),
            version_command,
            stdout: String::from_utf8_lossy(&output.stdout).to_string(),
            stderr: String::from_utf8_lossy(&output.stderr).to_string(),
            error: None,
        },
        Err(error) => ToolStatus {
            name: name.to_string(),
            program: resolved.program,
            source: resolved.source,
            exists,
            success: false,
            version_command,
            stdout: String::new(),
            stderr: String::new(),
            error: Some(error.to_string()),
        },
    }
}

fn run_version_command(
    resolved: &ResolvedTool,
    version_args: &[&str],
) -> std::io::Result<std::process::Output> {
    Command::new(&resolved.program)
        .args(version_args)
        .envs(resolved.envs.iter().map(|(key, value)| (key, value)))
        .output()
}
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
