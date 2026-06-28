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
