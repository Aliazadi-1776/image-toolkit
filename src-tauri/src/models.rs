<<<<<<< HEAD
use std::collections::HashMap;

=======
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageFile {
    pub path: String,
    pub file_name: String,
<<<<<<< HEAD
    pub extension: String,
    pub size_bytes: u64,
    pub width: Option<u32>,
    pub height: Option<u32>,
=======
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ToolPaths {
    pub magick: String,
    pub cwebp: String,
    pub avifenc: String,
<<<<<<< HEAD
    pub exiftool: String,
=======
}

impl Default for ToolPaths {
    fn default() -> Self {
        Self {
            magick: "magick".to_string(),
            cwebp: "cwebp".to_string(),
            avifenc: "avifenc".to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OutputMode {
    SameFolder,
    CustomFolder,
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OutputOptions {
<<<<<<< HEAD
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
=======
    pub mode: OutputMode,
    pub custom_folder: Option<String>,
    pub overwrite: bool,
    pub create_output_folder: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
pub enum ResizeMode {
    Fit,
    Fill,
    Stretch,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
<<<<<<< HEAD
pub enum TargetFormat {
    Webp,
=======
pub struct ResizeOptions {
    pub enabled: bool,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub keep_aspect_ratio: bool,
    pub mode: ResizeMode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TargetFormat {
    WebP,
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
    Avif,
    Png,
    Jpeg,
    Tiff,
    Bmp,
    Gif,
    Ico,
}

<<<<<<< HEAD
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
=======
impl TargetFormat {
    pub fn extension(&self) -> &'static str {
        match self {
            TargetFormat::WebP => "webp",
            TargetFormat::Avif => "avif",
            TargetFormat::Png => "png",
            TargetFormat::Jpeg => "jpg",
            TargetFormat::Tiff => "tiff",
            TargetFormat::Bmp => "bmp",
            TargetFormat::Gif => "gif",
            TargetFormat::Ico => "ico",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
pub enum CompressionMode {
    Lossy,
    Lossless,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataOptions {
<<<<<<< HEAD
    pub strip_all: bool,
    pub strip_exif: bool,
    pub strip_gps: bool,
    pub strip_camera_info: bool,
    pub strip_icc: bool,
    pub strip_xmp: bool,
=======
    pub strip_exif: bool,
    pub strip_gps: bool,
    pub strip_camera_information: bool,
    pub strip_icc_profile: bool,
    pub strip_xmp: bool,
    pub strip_everything: bool,
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataWriteOptions {
<<<<<<< HEAD
    pub title: Option<String>,
=======
    pub copyright: Option<String>,
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
    pub author: Option<String>,
    pub creator: Option<String>,
    pub description: Option<String>,
    pub keywords: Option<String>,
<<<<<<< HEAD
    pub copyright: Option<String>,
=======
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
    pub comment: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
<<<<<<< HEAD
=======
pub enum ColorProfile {
    KeepOriginal,
    Srgb,
    AdobeRgb,
    DisplayP3,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DpiOptions {
    pub enabled: bool,
    pub value: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum NamingMode {
    KeepOriginal,
    Rename,
    Prefix,
    Suffix,
    Sequential,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NamingOptions {
    pub mode: NamingMode,
    pub value: Option<String>,
    pub start_number: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
#[serde(rename_all = "camelCase")]
pub struct OperationRequest {
    pub input_files: Vec<ImageFile>,
    pub output: OutputOptions,
<<<<<<< HEAD
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
=======
    pub resize: ResizeOptions,
    pub target_format: TargetFormat,
    pub quality: u8,
    pub compression: CompressionMode,
    pub metadata: MetadataOptions,
    pub metadata_write: MetadataWriteOptions,
    pub color_profile: ColorProfile,
    pub dpi: DpiOptions,
    pub naming: NamingOptions,
    pub tools: ToolPaths,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
#[serde(rename_all = "camelCase")]
pub struct CommandPreview {
    pub tool: String,
    pub args: Vec<String>,
<<<<<<< HEAD
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
=======
    pub command: String,
    pub output_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RunLogEntry {
    pub input_path: String,
    pub output_path: String,
    pub command: String,
    pub status: String,
    pub stdout: String,
    pub stderr: String,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RunSummary {
    pub total: usize,
    pub completed: usize,
    pub failed: usize,
    pub entries: Vec<RunLogEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
#[serde(rename_all = "camelCase")]
pub struct QueueStartResult {
    pub accepted: bool,
    pub total: usize,
}

<<<<<<< HEAD
#[derive(Debug, Clone, Serialize)]
=======
#[derive(Debug, Clone, Serialize, Deserialize)]
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
#[serde(rename_all = "camelCase")]
pub struct QueueStartedEvent {
    pub total: usize,
}

<<<<<<< HEAD
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
=======
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueProgressEvent {
    pub index: usize,
    pub total: usize,
    pub input_path: String,
    pub file_name: String,
    pub status: String,
    pub completed: usize,
    pub failed: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueItemFinishedEvent {
    pub index: usize,
    pub total: usize,
    pub entry: RunLogEntry,
    pub completed: usize,
    pub failed: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueFinishedEvent {
    pub total: usize,
    pub completed: usize,
    pub failed: usize,
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}
