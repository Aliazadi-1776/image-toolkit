use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageFile {
    pub path: String,
    pub file_name: String,
    pub extension: String,
    pub size_bytes: u64,
    pub width: Option<u32>,
    pub height: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ToolPaths {
    pub magick: String,
    pub cwebp: String,
    pub avifenc: String,
    pub exiftool: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OutputOptions {
    pub directory: Option<String>,
    pub overwrite: bool,
    pub use_source_directory: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResizeOptions {
    pub enabled: bool,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub mode: ResizeMode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FileProcessingOptions {
    pub target_format: TargetFormat,
    pub quality: u8,
    pub compression: CompressionMode,
    pub resize: ResizeOptions,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CropOptions {
    pub enabled: bool,
    pub unit: CropUnit,
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
    pub relative_x: f64,
    pub relative_y: f64,
    pub relative_width: f64,
    pub relative_height: f64,
    pub zoom: f64,
    pub aspect: CropAspect,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum CropAspect {
    Free,
    Original,
    Square,
    FourThree,
    SixteenNine,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum CropUnit {
    Pixels,
    Percent,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum ResizeMode {
    Fit,
    Fill,
    Stretch,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum TargetFormat {
    Webp,
    Avif,
    Png,
    Jpeg,
    Tiff,
    Bmp,
    Gif,
    Ico,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum CompressionMode {
    Lossy,
    Lossless,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataOptions {
    pub strip_all: bool,
    pub strip_exif: bool,
    pub strip_gps: bool,
    pub strip_camera_info: bool,
    pub strip_icc: bool,
    pub strip_xmp: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataWriteOptions {
    pub title: Option<String>,
    pub author: Option<String>,
    pub creator: Option<String>,
    pub description: Option<String>,
    pub keywords: Option<String>,
    pub copyright: Option<String>,
    pub comment: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OperationRequest {
    pub input_files: Vec<ImageFile>,
    pub output: OutputOptions,
    pub target_format: TargetFormat,
    pub quality: u8,
    pub compression: CompressionMode,
    pub resize: ResizeOptions,
    #[serde(default)]
    pub per_file_options: HashMap<String, FileProcessingOptions>,
    pub crop: CropOptions,
    #[serde(default)]
    pub per_file_crops: HashMap<String, CropOptions>,
    pub metadata: MetadataOptions,
    pub write_metadata: MetadataWriteOptions,
    pub tools: ToolPaths,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandPreview {
    pub tool: String,
    pub args: Vec<String>,
    pub command_line: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunEntry {
    pub input: String,
    pub output: String,
    pub command_line: String,
    pub success: bool,
    pub stderr: String,
    pub stdout: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunSummary {
    pub total: usize,
    pub succeeded: usize,
    pub failed: usize,
    pub entries: Vec<RunEntry>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueStartResult {
    pub accepted: bool,
    pub total: usize,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueStartedEvent {
    pub total: usize,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueProgressEvent {
    pub current_index: usize,
    pub total: usize,
    pub input: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueItemFinishedEvent {
    pub entry: RunEntry,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueFinishedEvent {
    pub summary: RunSummary,
}
