use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageFile {
    pub path: String,
    pub file_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ToolPaths {
    pub magick: String,
    pub cwebp: String,
    pub avifenc: String,
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
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OutputOptions {
    pub mode: OutputMode,
    pub custom_folder: Option<String>,
    pub overwrite: bool,
    pub create_output_folder: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResizeMode {
    Fit,
    Fill,
    Stretch,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
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
    Avif,
    Png,
    Jpeg,
    Tiff,
    Bmp,
    Gif,
    Ico,
}

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
pub enum CompressionMode {
    Lossy,
    Lossless,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataOptions {
    pub strip_exif: bool,
    pub strip_gps: bool,
    pub strip_camera_information: bool,
    pub strip_icc_profile: bool,
    pub strip_xmp: bool,
    pub strip_everything: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataWriteOptions {
    pub copyright: Option<String>,
    pub author: Option<String>,
    pub creator: Option<String>,
    pub description: Option<String>,
    pub keywords: Option<String>,
    pub comment: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
#[serde(rename_all = "camelCase")]
pub struct OperationRequest {
    pub input_files: Vec<ImageFile>,
    pub output: OutputOptions,
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
#[serde(rename_all = "camelCase")]
pub struct CommandPreview {
    pub tool: String,
    pub args: Vec<String>,
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
#[serde(rename_all = "camelCase")]
pub struct QueueStartResult {
    pub accepted: bool,
    pub total: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QueueStartedEvent {
    pub total: usize,
}

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
}
