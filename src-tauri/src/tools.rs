<<<<<<< HEAD
use std::path::Path; use std::process::Command;
#[derive(Debug, Clone, Copy)] pub enum ToolKind { Magick, Cwebp, Avifenc, Exiftool }
#[derive(Debug, Clone)] pub struct ResolvedTool { pub program:String, pub source:String }
pub fn resolve_tool(kind:ToolKind, requested:&str)->ResolvedTool{ if !requested.trim().is_empty() && command_works(requested, version_args(kind)){ return ResolvedTool{program:requested.to_string(),source:"custom-or-path".to_string()}; } for c in candidates(kind){ if command_works(c, version_args(kind)){ return ResolvedTool{program:c.to_string(),source:"system-path".to_string()}; } } ResolvedTool{program:fallback_program(kind).to_string(),source:"missing".to_string()} }
pub fn version_args(kind:ToolKind)->&'static [&'static str]{ match kind{ToolKind::Magick=>&["-version"],ToolKind::Cwebp=>&["-version"],ToolKind::Avifenc=>&["--version"],ToolKind::Exiftool=>&["-ver"]} }
pub fn tool_name(kind:ToolKind)->&'static str{ match kind{ToolKind::Magick=>"ImageMagick",ToolKind::Cwebp=>"cwebp",ToolKind::Avifenc=>"avifenc",ToolKind::Exiftool=>"ExifTool"} }
fn fallback_program(kind:ToolKind)->&'static str{ match kind{ToolKind::Magick=>"magick",ToolKind::Cwebp=>"cwebp",ToolKind::Avifenc=>"avifenc",ToolKind::Exiftool=>"exiftool"} }
fn candidates(kind:ToolKind)->&'static [&'static str]{ match kind{ToolKind::Magick=>&["magick","convert"],ToolKind::Cwebp=>&["cwebp"],ToolKind::Avifenc=>&["avifenc"],ToolKind::Exiftool=>&["exiftool"]} }
fn command_works(program:&str,args:&[&str])->bool{ if Path::new(program).is_file(){ return Command::new(program).args(args).output().is_ok(); } Command::new(program).args(args).output().is_ok() }
=======
use std::collections::HashSet;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

use tauri::path::BaseDirectory;
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Copy)]
pub enum ToolKind {
    Magick,
    Cwebp,
    Avifenc,
}

#[derive(Debug, Clone)]
pub struct ResolvedTool {
    pub program: String,
    pub envs: Vec<(String, String)>,
    pub source: String,
}

pub fn resolve_tool(app: &AppHandle, kind: ToolKind, fallback: &str) -> ResolvedTool {
    if let Some(tool) = resolve_development_tool(kind) {
        return tool;
    }

    if let Some(tool) = resolve_bundled_tool(app, kind) {
        return tool;
    }

    ResolvedTool {
        program: fallback.to_string(),
        envs: Vec::new(),
        source: "system".to_string(),
    }
}

fn resolve_development_tool(kind: ToolKind) -> Option<ResolvedTool> {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));

    for relative_path in candidate_paths(kind) {
        let full_path = manifest_dir.join(relative_path);

        if is_executable_candidate(&full_path) {
            return Some(build_resolved_tool(
                full_path,
                manifest_dir.join("vendor").join(platform_folder()),
                "development-vendor",
                kind,
            ));
        }
    }

    None
}

fn resolve_bundled_tool(app: &AppHandle, kind: ToolKind) -> Option<ResolvedTool> {
    for relative_path in candidate_paths(kind) {
        let resolved_path = app
            .path()
            .resolve(relative_path, BaseDirectory::Resource)
            .ok()?;

        if is_executable_candidate(&resolved_path) {
            let vendor_root = app
                .path()
                .resolve(format!("vendor/{}", platform_folder()), BaseDirectory::Resource)
                .unwrap_or_else(|_| {
                    resolved_path
                        .parent()
                        .map(Path::to_path_buf)
                        .unwrap_or_else(|| resolved_path.clone())
                });

            return Some(build_resolved_tool(
                resolved_path,
                vendor_root,
                "bundled-resource",
                kind,
            ));
        }
    }

    None
}

fn candidate_paths(kind: ToolKind) -> Vec<String> {
    let platform = platform_folder();

    match kind {
        ToolKind::Magick => {
            if cfg!(target_os = "windows") {
                vec![
                    format!("vendor/{platform}/imagemagick/magick.exe"),
                    format!("vendor/{platform}/imagemagick/bin/magick.exe"),
                ]
            } else {
                vec![
                    format!("vendor/{platform}/imagemagick/AppRun"),
                    format!("vendor/{platform}/imagemagick/usr/bin/magick"),
                    format!("vendor/{platform}/imagemagick/bin/magick"),
                    format!("vendor/{platform}/imagemagick/magick"),
                ]
            }
        }
        ToolKind::Cwebp => {
            if cfg!(target_os = "windows") {
                vec![format!("vendor/{platform}/cwebp.exe")]
            } else {
                vec![format!("vendor/{platform}/cwebp")]
            }
        }
        ToolKind::Avifenc => {
            if cfg!(target_os = "windows") {
                vec![format!("vendor/{platform}/avifenc.exe")]
            } else {
                vec![format!("vendor/{platform}/avifenc")]
            }
        }
    }
}

fn build_resolved_tool(
    program_path: PathBuf,
    vendor_root: PathBuf,
    source: &str,
    kind: ToolKind,
) -> ResolvedTool {
    let program = program_path.to_string_lossy().to_string();
    let mut envs = Vec::new();

    let tool_dir = program_path
        .parent()
        .map(Path::to_path_buf)
        .unwrap_or_else(|| vendor_root.clone());

    let imagemagick_root = vendor_root.join("imagemagick");

    let mut path_dirs = vec![
        vendor_root.clone(),
        tool_dir.clone(),
        imagemagick_root.clone(),
        imagemagick_root.join("usr/bin"),
        imagemagick_root.join("bin"),
    ];

    path_dirs.retain(|path| path.exists());

    if let Some(path_value) = join_paths_with_existing("PATH", &path_dirs) {
        envs.push(("PATH".to_string(), path_value));
    }

    if cfg!(target_os = "linux") {
        let mut library_dirs = vec![
            vendor_root.join("lib"),
            imagemagick_root.clone(),
            imagemagick_root.join("lib"),
            imagemagick_root.join("usr/lib"),
            imagemagick_root.join("usr/lib/x86_64-linux-gnu"),
            imagemagick_root.join("lib/x86_64-linux-gnu"),
        ];

        library_dirs.extend(find_dirs_containing_extension(&imagemagick_root, "so", 6));
        library_dirs.extend(find_dirs_containing_extension(&vendor_root, "so", 4));

        dedupe_existing_paths(&mut library_dirs);

        if let Some(ld_library_path) = join_paths_with_existing("LD_LIBRARY_PATH", &library_dirs) {
            envs.push(("LD_LIBRARY_PATH".to_string(), ld_library_path));
        }
    }

    if cfg!(target_os = "macos") {
        let mut library_dirs = vec![
            vendor_root.join("lib"),
            imagemagick_root.join("lib"),
            imagemagick_root.join("usr/lib"),
        ];

        library_dirs.extend(find_dirs_containing_extension(&imagemagick_root, "dylib", 6));

        dedupe_existing_paths(&mut library_dirs);

        if let Some(dyld_library_path) = join_paths_with_existing("DYLD_LIBRARY_PATH", &library_dirs)
        {
            envs.push(("DYLD_LIBRARY_PATH".to_string(), dyld_library_path));
        }
    }

    if matches!(kind, ToolKind::Magick) {
        envs.push((
            "MAGICK_HOME".to_string(),
            imagemagick_root.to_string_lossy().to_string(),
        ));

        envs.push((
            "APPDIR".to_string(),
            imagemagick_root.to_string_lossy().to_string(),
        ));

        let mut config_dirs = find_magick_config_dirs(&imagemagick_root, 6);
        dedupe_existing_paths(&mut config_dirs);

        if !config_dirs.is_empty() {
            envs.push((
                "MAGICK_CONFIGURE_PATH".to_string(),
                join_paths_only(&config_dirs),
            ));
        }

        let mut coder_dirs = find_magick_coder_dirs(&imagemagick_root, 8);
        dedupe_existing_paths(&mut coder_dirs);

        if !coder_dirs.is_empty() {
            envs.push((
                "MAGICK_CODER_MODULE_PATH".to_string(),
                join_paths_only(&coder_dirs),
            ));
        }
    }

    ResolvedTool {
        program,
        envs,
        source: source.to_string(),
    }
}

fn is_executable_candidate(path: &Path) -> bool {
    path.exists() && path.is_file()
}

fn platform_folder() -> &'static str {
    if cfg!(target_os = "windows") {
        "windows-x64"
    } else if cfg!(target_os = "macos") && cfg!(target_arch = "aarch64") {
        "macos-arm64"
    } else if cfg!(target_os = "macos") {
        "macos-x64"
    } else {
        "linux-x64"
    }
}

fn join_paths_with_existing(env_key: &str, paths: &[PathBuf]) -> Option<String> {
    let mut parts: Vec<PathBuf> = paths
        .iter()
        .filter(|path| path.exists())
        .cloned()
        .collect();

    if let Some(existing) = env::var_os(env_key) {
        parts.extend(env::split_paths(&existing));
    }

    if parts.is_empty() {
        return None;
    }

    Some(join_paths_only(&parts))
}

fn join_paths_only(paths: &[PathBuf]) -> String {
    env::join_paths(paths)
        .unwrap_or_default()
        .to_string_lossy()
        .to_string()
}

fn dedupe_existing_paths(paths: &mut Vec<PathBuf>) {
    let mut seen = HashSet::new();

    paths.retain(|path| {
        if !path.exists() {
            return false;
        }

        let key = path.to_string_lossy().to_string();

        if seen.contains(&key) {
            false
        } else {
            seen.insert(key);
            true
        }
    });
}

fn find_dirs_containing_extension(root: &Path, extension: &str, max_depth: usize) -> Vec<PathBuf> {
    let mut dirs = Vec::new();
    walk_dirs(root, max_depth, &mut |path| {
        if path.is_file()
            && path
                .extension()
                .map(|ext| ext.to_string_lossy().contains(extension))
                .unwrap_or(false)
        {
            if let Some(parent) = path.parent() {
                dirs.push(parent.to_path_buf());
            }
        }
    });

    dirs
}

fn find_magick_config_dirs(root: &Path, max_depth: usize) -> Vec<PathBuf> {
    let mut dirs = Vec::new();

    walk_dirs(root, max_depth, &mut |path| {
        if !path.is_file() {
            return;
        }

        let Some(file_name) = path.file_name().map(|value| value.to_string_lossy()) else {
            return;
        };

        if matches!(
            file_name.as_ref(),
            "delegates.xml" | "policy.xml" | "colors.xml" | "type.xml" | "type-ghostscript.xml"
        ) {
            if let Some(parent) = path.parent() {
                dirs.push(parent.to_path_buf());
            }
        }
    });

    dirs
}

fn find_magick_coder_dirs(root: &Path, max_depth: usize) -> Vec<PathBuf> {
    let mut dirs = Vec::new();

    walk_dirs(root, max_depth, &mut |path| {
        if !path.is_file() {
            return;
        }

        let path_text = path.to_string_lossy();

        if path_text.contains("coders") && path_text.ends_with(".so") {
            if let Some(parent) = path.parent() {
                dirs.push(parent.to_path_buf());
            }
        }
    });

    dirs
}

fn walk_dirs<F>(root: &Path, max_depth: usize, callback: &mut F)
where
    F: FnMut(&Path),
{
    if max_depth == 0 || !root.exists() {
        return;
    }

    let Ok(entries) = fs::read_dir(root) else {
        return;
    };

    for entry in entries.flatten() {
        let path = entry.path();
        callback(&path);

        if path.is_dir() {
            walk_dirs(&path, max_depth - 1, callback);
        }
    }
}
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
