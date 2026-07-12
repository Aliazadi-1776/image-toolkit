use std::path::Path; use std::process::Command;
#[derive(Debug, Clone, Copy)] pub enum ToolKind { Magick, Cwebp, Avifenc, Exiftool }
#[derive(Debug, Clone)] pub struct ResolvedTool { pub program:String, pub source:String }
pub fn resolve_tool(kind:ToolKind, requested:&str)->ResolvedTool{ if !requested.trim().is_empty() && command_works(requested, version_args(kind)){ return ResolvedTool{program:requested.to_string(),source:"custom-or-path".to_string()}; } for c in candidates(kind){ if command_works(c, version_args(kind)){ return ResolvedTool{program:c.to_string(),source:"system-path".to_string()}; } } ResolvedTool{program:fallback_program(kind).to_string(),source:"missing".to_string()} }
pub fn version_args(kind:ToolKind)->&'static [&'static str]{ match kind{ToolKind::Magick=>&["-version"],ToolKind::Cwebp=>&["-version"],ToolKind::Avifenc=>&["--version"],ToolKind::Exiftool=>&["-ver"]} }
pub fn tool_name(kind:ToolKind)->&'static str{ match kind{ToolKind::Magick=>"ImageMagick",ToolKind::Cwebp=>"cwebp",ToolKind::Avifenc=>"avifenc",ToolKind::Exiftool=>"ExifTool"} }
fn fallback_program(kind:ToolKind)->&'static str{ match kind{ToolKind::Magick=>"magick",ToolKind::Cwebp=>"cwebp",ToolKind::Avifenc=>"avifenc",ToolKind::Exiftool=>"exiftool"} }
fn candidates(kind:ToolKind)->&'static [&'static str]{ match kind{ToolKind::Magick=>&["magick","convert"],ToolKind::Cwebp=>&["cwebp"],ToolKind::Avifenc=>&["avifenc"],ToolKind::Exiftool=>&["exiftool"]} }
fn command_works(program:&str,args:&[&str])->bool{ if Path::new(program).is_file(){ return Command::new(program).args(args).output().is_ok(); } Command::new(program).args(args).output().is_ok() }
