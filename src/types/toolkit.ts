<<<<<<< HEAD
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
=======
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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76

export interface ImageFile {
  path: string;
  fileName: string;
<<<<<<< HEAD
  extension: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
=======
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}

export interface ToolPaths {
  magick: string;
  cwebp: string;
  avifenc: string;
<<<<<<< HEAD
  exiftool: string;
}

export interface OutputOptions {
  directory?: string | null;
  overwrite: boolean;
  useSourceDirectory: boolean;
=======
}

export interface OutputOptions {
  mode: OutputMode;
  customFolder?: string | null;
  overwrite: boolean;
  createOutputFolder: boolean;
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}

export interface ResizeOptions {
  enabled: boolean;
  width?: number | null;
  height?: number | null;
<<<<<<< HEAD
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
=======
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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  author?: string | null;
  creator?: string | null;
  description?: string | null;
  keywords?: string | null;
<<<<<<< HEAD
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
=======
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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  tools: ToolPaths;
}

export interface CommandPreview {
  tool: string;
  args: string[];
<<<<<<< HEAD
  commandLine: string;
}

export interface RunEntry {
  input: string;
  output: string;
  commandLine: string;
  success: boolean;
  stderr: string;
  stdout: string;
=======
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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}

export interface RunSummary {
  total: number;
<<<<<<< HEAD
  succeeded: number;
  failed: number;
  entries: RunEntry[];
=======
  completed: number;
  failed: number;
  entries: RunLogEntry[];
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}

export interface QueueStartResult {
  accepted: boolean;
  total: number;
}

export interface QueueStartedEvent {
  total: number;
}

export interface QueueProgressEvent {
<<<<<<< HEAD
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
=======
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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}
