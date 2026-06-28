export type OutputMode = "SameFolder" | "CustomFolder";
export type ResizeMode = "Fit" | "Fill" | "Stretch";

export type TargetFormat =
  | "WebP"
  | "Avif"
  | "Png"
  | "Jpeg"
  | "Tiff"
  | "Bmp"
  | "Gif"
  | "Ico";

export type CompressionMode = "Lossy" | "Lossless";

export type ColorProfile = "KeepOriginal" | "Srgb" | "AdobeRgb" | "DisplayP3";

export type NamingMode =
  | "KeepOriginal"
  | "Rename"
  | "Prefix"
  | "Suffix"
  | "Sequential";

export interface ImageFile {
  path: string;
  fileName: string;
}

export interface ToolPaths {
  magick: string;
  cwebp: string;
  avifenc: string;
}

export interface OutputOptions {
  mode: OutputMode;
  customFolder?: string | null;
  overwrite: boolean;
  createOutputFolder: boolean;
}

export interface ResizeOptions {
  enabled: boolean;
  width?: number | null;
  height?: number | null;
  keepAspectRatio: boolean;
  mode: ResizeMode;
}

export interface MetadataOptions {
  stripExif: boolean;
  stripGps: boolean;
  stripCameraInformation: boolean;
  stripIccProfile: boolean;
  stripXmp: boolean;
  stripEverything: boolean;
}

export interface MetadataWriteOptions {
  copyright?: string | null;
  author?: string | null;
  creator?: string | null;
  description?: string | null;
  keywords?: string | null;
  comment?: string | null;
}

export interface DpiOptions {
  enabled: boolean;
  value?: number | null;
}

export interface NamingOptions {
  mode: NamingMode;
  value?: string | null;
  startNumber?: number | null;
}

export interface OperationRequest {
  inputFiles: ImageFile[];
  output: OutputOptions;
  resize: ResizeOptions;
  targetFormat: TargetFormat;
  quality: number;
  compression: CompressionMode;
  metadata: MetadataOptions;
  metadataWrite: MetadataWriteOptions;
  colorProfile: ColorProfile;
  dpi: DpiOptions;
  naming: NamingOptions;
  tools: ToolPaths;
}

export interface CommandPreview {
  tool: string;
  args: string[];
  command: string;
  outputPath: string;
}

export interface RunLogEntry {
  inputPath: string;
  outputPath: string;
  command: string;
  status: "waiting" | "processing" | "completed" | "failed" | string;
  stdout: string;
  stderr: string;
  error?: string | null;
}

export interface RunSummary {
  total: number;
  completed: number;
  failed: number;
  entries: RunLogEntry[];
}

export interface QueueStartResult {
  accepted: boolean;
  total: number;
}

export interface QueueStartedEvent {
  total: number;
}

export interface QueueProgressEvent {
  index: number;
  total: number;
  inputPath: string;
  fileName: string;
  status: string;
  completed: number;
  failed: number;
}

export interface QueueItemFinishedEvent {
  index: number;
  total: number;
  entry: RunLogEntry;
  completed: number;
  failed: number;
}

export interface QueueFinishedEvent {
  total: number;
  completed: number;
  failed: number;
}
