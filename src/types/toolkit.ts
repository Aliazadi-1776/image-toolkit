export type TargetFormat =
  | "webp"
  | "avif"
  | "png"
  | "jpeg"
  | "tiff"
  | "bmp"
  | "gif"
  | "ico";

export type CompressionMode = "lossy" | "lossless";
export type ResizeMode = "fit" | "fill" | "stretch";
export type CropAspect = "free" | "original" | "square" | "fourThree" | "sixteenNine";
export type CropUnit = "pixels" | "percent";

export interface ImageFile {
  path: string;
  fileName: string;
  extension: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
}

export interface ToolPaths {
  magick: string;
  cwebp: string;
  avifenc: string;
  exiftool: string;
}

export interface OutputOptions {
  directory?: string | null;
  overwrite: boolean;
  useSourceDirectory: boolean;
}

export interface ResizeOptions {
  enabled: boolean;
  width?: number | null;
  height?: number | null;
  mode: ResizeMode;
}

export interface FileProcessingOptions {
  targetFormat: TargetFormat;
  quality: number;
  compression: CompressionMode;
  resize: ResizeOptions;
}

export interface CropOptions {
  enabled: boolean;
  unit: CropUnit;
  x: number;
  y: number;
  width: number;
  height: number;
  relativeX: number;
  relativeY: number;
  relativeWidth: number;
  relativeHeight: number;
  zoom: number;
  aspect: CropAspect;
}

export interface MetadataOptions {
  stripAll: boolean;
  stripExif: boolean;
  stripGps: boolean;
  stripCameraInfo: boolean;
  stripIcc: boolean;
  stripXmp: boolean;
}

export interface MetadataWriteOptions {
  title?: string | null;
  author?: string | null;
  creator?: string | null;
  description?: string | null;
  keywords?: string | null;
  copyright?: string | null;
  comment?: string | null;
}

export interface OperationRequest {
  inputFiles: ImageFile[];
  output: OutputOptions;
  targetFormat: TargetFormat;
  quality: number;
  compression: CompressionMode;
  resize: ResizeOptions;
  perFileOptions: Record<string, FileProcessingOptions>;
  crop: CropOptions;
  perFileCrops: Record<string, CropOptions>;
  metadata: MetadataOptions;
  writeMetadata: MetadataWriteOptions;
  tools: ToolPaths;
}

export interface CommandPreview {
  tool: string;
  args: string[];
  commandLine: string;
}

export interface RunEntry {
  input: string;
  output: string;
  commandLine: string;
  success: boolean;
  stderr: string;
  stdout: string;
}

export interface RunSummary {
  total: number;
  succeeded: number;
  failed: number;
  entries: RunEntry[];
}

export interface QueueStartResult {
  accepted: boolean;
  total: number;
}

export interface QueueStartedEvent {
  total: number;
}

export interface QueueProgressEvent {
  currentIndex: number;
  total: number;
  input: string;
}

export interface QueueItemFinishedEvent {
  entry: RunEntry;
}

export interface QueueFinishedEvent {
  summary: RunSummary;
}

export interface ToolStatus {
  name: string;
  program: string;
  source: string;
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string | null;
}
