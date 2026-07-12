import { create } from "zustand";
import type {
  CommandPreview,
  CompressionMode,
<<<<<<< HEAD
  CropAspect,
  CropOptions,
  CropUnit,
  FileProcessingOptions,
=======
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  ImageFile,
  MetadataOptions,
  MetadataWriteOptions,
  OperationRequest,
<<<<<<< HEAD
  QueueFinishedEvent,
  QueueItemFinishedEvent,
  QueueProgressEvent,
  QueueStartedEvent,
  ResizeMode,
  RunSummary,
  TargetFormat,
=======
  ResizeMode,
  RunLogEntry,
  RunSummary,
  TargetFormat,
  ToolPaths,
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
} from "@/types/toolkit";
import { getCommandPreview, startQueue } from "@/lib/tauri";

interface ToolkitState {
  request: OperationRequest;
<<<<<<< HEAD
  selectedCropPath: string | null;
  selectedOptionsPath: string | null;
  preview: CommandPreview | null;
  previewError: string | null;
=======
  preview: CommandPreview | null;
  previewError: string | null;

>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  isRunning: boolean;
  currentFile: string | null;
  currentIndex: number;
  runSummary: RunSummary | null;
  runError: string | null;
<<<<<<< HEAD
  setFiles: (files: ImageFile[]) => void;
  clearFiles: () => void;
  setSelectedOptionsPath: (path: string) => void;
  getOptionsForFile: (file?: ImageFile | null) => FileProcessingOptions;
  applySelectedOptionsToAll: () => void;
  setFileTargetFormat: (path: string, format: TargetFormat) => void;
  setFileCompression: (path: string, mode: CompressionMode) => void;
  setFileQuality: (path: string, quality: number) => void;
  setFileResizeEnabled: (path: string, enabled: boolean) => void;
  setFileResizeWidth: (path: string, width: number | null) => void;
  setFileResizeHeight: (path: string, height: number | null) => void;
  setFileResizeMode: (path: string, mode: ResizeMode) => void;
  setTargetFormat: (format: TargetFormat) => void;
  setCompression: (mode: CompressionMode) => void;
  setQuality: (quality: number) => void;
  setResizeEnabled: (enabled: boolean) => void;
  setResizeWidth: (width: number | null) => void;
  setResizeHeight: (height: number | null) => void;
  setResizeMode: (mode: ResizeMode) => void;
  setSelectedCropPath: (path: string) => void;
  getCropForFile: (file?: ImageFile | null) => CropOptions;
  setCropEnabled: (enabled: boolean) => void;
  setCropEnabledForPath: (path: string, enabled: boolean) => void;
  setCropPixels: (crop: { x: number; y: number; width: number; height: number }, reference?: ImageFile) => void;
  setCropPixelsForPath: (
    path: string,
    crop: { x: number; y: number; width: number; height: number },
    reference?: ImageFile,
  ) => void;
  setCropUnit: (unit: CropUnit) => void;
  setCropZoom: (zoom: number) => void;
  setCropAspect: (aspect: CropAspect) => void;
  setCropAspectForPath: (path: string, aspect: CropAspect) => void;
  resetCropToImage: () => void;
  resetCropForPath: (path: string) => void;
  applySelectedCropToAll: () => void;
  setOutputOverwrite: (overwrite: boolean) => void;
  setUseSourceDirectory: (enabled: boolean) => void;
  setOutputDirectory: (directory: string | null) => void;
  setMetadataFlag: (key: keyof MetadataOptions, value: boolean) => void;
  setMetadataWriteField: (key: keyof MetadataWriteOptions, value: string) => void;
  refreshPreview: () => Promise<void>;
  execute: () => Promise<void>;
  queueStarted: (event: QueueStartedEvent) => void;
  queueProgress: (event: QueueProgressEvent) => void;
  queueItemFinished: (event: QueueItemFinishedEvent) => void;
  queueFinished: (event: QueueFinishedEvent) => void;
}

const defaultResize = {
  enabled: false,
  width: null,
  height: null,
  mode: "fit" as ResizeMode,
};

const defaultCrop: CropOptions = {
  enabled: false,
  unit: "percent",
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  relativeX: 0,
  relativeY: 0,
  relativeWidth: 1,
  relativeHeight: 1,
  zoom: 1,
  aspect: "free",
};

const defaultFileOptions: FileProcessingOptions = {
  targetFormat: "webp",
  quality: 80,
  compression: "lossy",
  resize: defaultResize,
};

const defaultRequest: OperationRequest = {
  inputFiles: [],
  output: {
    directory: null,
    overwrite: false,
    useSourceDirectory: true,
  },
  targetFormat: defaultFileOptions.targetFormat,
  quality: defaultFileOptions.quality,
  compression: defaultFileOptions.compression,
  resize: defaultFileOptions.resize,
  perFileOptions: {},
  crop: defaultCrop,
  perFileCrops: {},
  metadata: {
    stripAll: false,
    stripExif: false,
    stripGps: false,
    stripCameraInfo: false,
    stripIcc: false,
    stripXmp: false,
  },
  writeMetadata: {
    title: "",
=======

  setFiles: (files: ImageFile[]) => void;
  clearFiles: () => void;
  setToolPath: (key: keyof ToolPaths, value: string) => void;
  setTargetFormat: (format: TargetFormat) => void;
  setQuality: (quality: number) => void;
  setCompression: (compression: CompressionMode) => void;
  setResizeWidth: (width: number | null) => void;
  setResizeHeight: (height: number | null) => void;
  setResizeMode: (mode: ResizeMode) => void;
  setResizeEnabled: (enabled: boolean) => void;
  setMetadataFlag: (key: keyof MetadataOptions, value: boolean) => void;
  setMetadataWriteField: (
    key: keyof MetadataWriteOptions,
    value: string,
  ) => void;
  setOverwrite: (overwrite: boolean) => void;

  refreshPreview: () => Promise<void>;
  execute: () => Promise<void>;

  queueStarted: (total: number) => void;
  queueProgress: (payload: {
    index: number;
    total: number;
    fileName: string;
    completed: number;
    failed: number;
  }) => void;
  queueItemFinished: (payload: {
    entry: RunLogEntry;
    completed: number;
    failed: number;
    total: number;
  }) => void;
  queueFinished: (payload: {
    total: number;
    completed: number;
    failed: number;
  }) => void;
}

const initialRequest: OperationRequest = {
  inputFiles: [],
  output: {
    mode: "SameFolder",
    customFolder: null,
    overwrite: false,
    createOutputFolder: true,
  },
  resize: {
    enabled: true,
    width: 1200,
    height: 1200,
    keepAspectRatio: true,
    mode: "Fit",
  },
  targetFormat: "WebP",
  quality: 80,
  compression: "Lossy",
  metadata: {
    stripExif: false,
    stripGps: false,
    stripCameraInformation: false,
    stripIccProfile: false,
    stripXmp: false,
    stripEverything: true,
  },
  metadataWrite: {
    copyright: "",
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
    author: "",
    creator: "",
    description: "",
    keywords: "",
<<<<<<< HEAD
    copyright: "",
    comment: "",
  },
=======
    comment: "",
  },
  colorProfile: "KeepOriginal",
  dpi: {
    enabled: false,
    value: null,
  },
  naming: {
    mode: "KeepOriginal",
    value: null,
    startNumber: 1,
  },
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  tools: {
    magick: "magick",
    cwebp: "cwebp",
    avifenc: "avifenc",
<<<<<<< HEAD
    exiftool: "exiftool",
  },
};

function getGlobalOptions(request: OperationRequest): FileProcessingOptions {
  return {
    targetFormat: request.targetFormat,
    quality: request.quality,
    compression: request.compression,
    resize: { ...request.resize },
  };
}

function buildOptionsMap(
  files: ImageFile[],
  previous: Record<string, FileProcessingOptions>,
  request: OperationRequest,
): Record<string, FileProcessingOptions> {
  const next: Record<string, FileProcessingOptions> = {};
  for (const file of files) {
    next[file.path] = previous[file.path] ?? getGlobalOptions(request);
  }
  return next;
}

function getDefaultCropForFile(file?: ImageFile | null): CropOptions {
  if (!file?.width || !file?.height) return { ...defaultCrop };
  return {
    ...defaultCrop,
    x: 0,
    y: 0,
    width: file.width,
    height: file.height,
    relativeX: 0,
    relativeY: 0,
    relativeWidth: 1,
    relativeHeight: 1,
  };
}

function buildCropMap(files: ImageFile[], previous: Record<string, CropOptions>): Record<string, CropOptions> {
  const next: Record<string, CropOptions> = {};
  for (const file of files) {
    next[file.path] = previous[file.path] ?? getDefaultCropForFile(file);
  }
  return next;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function cropWithPixels(
  current: CropOptions,
  crop: { x: number; y: number; width: number; height: number },
  reference?: ImageFile | null,
): CropOptions {
  const width = reference?.width || 0;
  const height = reference?.height || 0;
  return {
    ...current,
    ...crop,
    unit: "percent",
    relativeX: width > 0 ? clamp(crop.x / width, 0, 1) : current.relativeX,
    relativeY: height > 0 ? clamp(crop.y / height, 0, 1) : current.relativeY,
    relativeWidth: width > 0 ? clamp(crop.width / width, 0.001, 1) : current.relativeWidth,
    relativeHeight: height > 0 ? clamp(crop.height / height, 0.001, 1) : current.relativeHeight,
  };
}

function updateOptionsForPath(
  state: ToolkitState,
  path: string,
  updater: (options: FileProcessingOptions) => FileProcessingOptions,
): Partial<ToolkitState> {
  const current = state.request.perFileOptions[path] ?? getGlobalOptions(state.request);
  const nextOptions = updater(current);
  const nextRequest: OperationRequest = {
    ...state.request,
    perFileOptions: {
      ...state.request.perFileOptions,
      [path]: nextOptions,
    },
  };
  if (state.selectedOptionsPath === path) {
    nextRequest.targetFormat = nextOptions.targetFormat;
    nextRequest.quality = nextOptions.quality;
    nextRequest.compression = nextOptions.compression;
    nextRequest.resize = { ...nextOptions.resize };
  }
  return { request: nextRequest };
}

export const useToolkitStore = create<ToolkitState>((set, get) => ({
  request: defaultRequest,
  selectedCropPath: null,
  selectedOptionsPath: null,
  preview: null,
  previewError: null,
=======
  },
};

export const useToolkitStore = create<ToolkitState>((set, get) => ({
  request: initialRequest,
  preview: null,
  previewError: null,

>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  isRunning: false,
  currentFile: null,
  currentIndex: 0,
  runSummary: null,
  runError: null,

  setFiles: (files) => {
<<<<<<< HEAD
    set((state) => {
      const perFileCrops = buildCropMap(files, state.request.perFileCrops || {});
      const perFileOptions = buildOptionsMap(files, state.request.perFileOptions || {}, state.request);
      const selectedCropPath =
        state.selectedCropPath && files.some((file) => file.path === state.selectedCropPath)
          ? state.selectedCropPath
          : files[0]?.path ?? null;
      const selectedOptionsPath =
        state.selectedOptionsPath && files.some((file) => file.path === state.selectedOptionsPath)
          ? state.selectedOptionsPath
          : files[0]?.path ?? null;
      const selectedCropFile = files.find((file) => file.path === selectedCropPath) ?? files[0];
      const selectedOptions = selectedOptionsPath ? perFileOptions[selectedOptionsPath] : getGlobalOptions(state.request);
      return {
        selectedCropPath,
        selectedOptionsPath,
        request: {
          ...state.request,
          inputFiles: files,
          crop: selectedCropFile ? perFileCrops[selectedCropFile.path] : defaultCrop,
          perFileCrops,
          targetFormat: selectedOptions.targetFormat,
          quality: selectedOptions.quality,
          compression: selectedOptions.compression,
          resize: selectedOptions.resize,
          perFileOptions,
        },
        previewError: null,
      };
    });
=======
    set((state) => ({
      request: {
        ...state.request,
        inputFiles: files,
      },
      runSummary: null,
      runError: null,
      currentFile: null,
      currentIndex: 0,
    }));
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  },

  clearFiles: () => {
    set((state) => ({
<<<<<<< HEAD
      selectedCropPath: null,
      selectedOptionsPath: null,
      request: {
        ...state.request,
        inputFiles: [],
        crop: defaultCrop,
        perFileCrops: {},
        perFileOptions: {},
=======
      request: {
        ...state.request,
        inputFiles: [],
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
      },
      preview: null,
      previewError: null,
      runSummary: null,
      runError: null,
      currentFile: null,
      currentIndex: 0,
    }));
  },

<<<<<<< HEAD
  setSelectedOptionsPath: (path) => {
    const options = get().request.perFileOptions[path] ?? getGlobalOptions(get().request);
    set((state) => ({
      selectedOptionsPath: path,
      request: {
        ...state.request,
        targetFormat: options.targetFormat,
        quality: options.quality,
        compression: options.compression,
        resize: { ...options.resize },
        perFileOptions: { ...state.request.perFileOptions, [path]: options },
=======
  setToolPath: (key, value) => {
    set((state) => ({
      request: {
        ...state.request,
        tools: {
          ...state.request.tools,
          [key]: value,
        },
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
      },
    }));
  },

<<<<<<< HEAD
  getOptionsForFile: (file) => {
    if (!file) return getGlobalOptions(get().request);
    return get().request.perFileOptions[file.path] ?? getGlobalOptions(get().request);
  },

  applySelectedOptionsToAll: () => {
    const selectedPath = get().selectedOptionsPath;
    if (!selectedPath) return;
    const selectedOptions = get().request.perFileOptions[selectedPath];
    if (!selectedOptions) return;
    set((state) => {
      const perFileOptions: Record<string, FileProcessingOptions> = {};
      for (const file of state.request.inputFiles) {
        perFileOptions[file.path] = {
          targetFormat: selectedOptions.targetFormat,
          quality: selectedOptions.quality,
          compression: selectedOptions.compression,
          resize: { ...selectedOptions.resize },
        };
      }
      return {
        request: {
          ...state.request,
          targetFormat: selectedOptions.targetFormat,
          quality: selectedOptions.quality,
          compression: selectedOptions.compression,
          resize: { ...selectedOptions.resize },
          perFileOptions,
        },
      };
    });
  },

  setFileTargetFormat: (path, format) => set((state) => updateOptionsForPath(state, path, (options) => ({ ...options, targetFormat: format }))),
  setFileCompression: (path, mode) => set((state) => updateOptionsForPath(state, path, (options) => ({ ...options, compression: mode }))),
  setFileQuality: (path, quality) => set((state) => updateOptionsForPath(state, path, (options) => ({ ...options, quality }))),
  setFileResizeEnabled: (path, enabled) => set((state) => updateOptionsForPath(state, path, (options) => ({ ...options, resize: { ...options.resize, enabled } }))),
  setFileResizeWidth: (path, width) => set((state) => updateOptionsForPath(state, path, (options) => ({ ...options, resize: { ...options.resize, width } }))),
  setFileResizeHeight: (path, height) => set((state) => updateOptionsForPath(state, path, (options) => ({ ...options, resize: { ...options.resize, height } }))),
  setFileResizeMode: (path, mode) => set((state) => updateOptionsForPath(state, path, (options) => ({ ...options, resize: { ...options.resize, mode } }))),

  setTargetFormat: (format) => {
    const selectedPath = get().selectedOptionsPath;
    if (selectedPath) return get().setFileTargetFormat(selectedPath, format);
    set((state) => ({ request: { ...state.request, targetFormat: format } }));
  },
  setCompression: (mode) => {
    const selectedPath = get().selectedOptionsPath;
    if (selectedPath) return get().setFileCompression(selectedPath, mode);
    set((state) => ({ request: { ...state.request, compression: mode } }));
  },
  setQuality: (quality) => {
    const selectedPath = get().selectedOptionsPath;
    if (selectedPath) return get().setFileQuality(selectedPath, quality);
    set((state) => ({ request: { ...state.request, quality } }));
  },
  setResizeEnabled: (enabled) => {
    const selectedPath = get().selectedOptionsPath;
    if (selectedPath) return get().setFileResizeEnabled(selectedPath, enabled);
    set((state) => ({ request: { ...state.request, resize: { ...state.request.resize, enabled } } }));
  },
  setResizeWidth: (width) => {
    const selectedPath = get().selectedOptionsPath;
    if (selectedPath) return get().setFileResizeWidth(selectedPath, width);
    set((state) => ({ request: { ...state.request, resize: { ...state.request.resize, width } } }));
  },
  setResizeHeight: (height) => {
    const selectedPath = get().selectedOptionsPath;
    if (selectedPath) return get().setFileResizeHeight(selectedPath, height);
    set((state) => ({ request: { ...state.request, resize: { ...state.request.resize, height } } }));
  },
  setResizeMode: (mode) => {
    const selectedPath = get().selectedOptionsPath;
    if (selectedPath) return get().setFileResizeMode(selectedPath, mode);
    set((state) => ({ request: { ...state.request, resize: { ...state.request.resize, mode } } }));
  },

  setSelectedCropPath: (path) => {
    const file = get().request.inputFiles.find((item) => item.path === path);
    const crop = file ? get().request.perFileCrops[path] ?? getDefaultCropForFile(file) : get().request.crop;
    set((state) => ({
      selectedCropPath: path,
      request: { ...state.request, crop, perFileCrops: { ...state.request.perFileCrops, [path]: crop } },
    }));
  },

  getCropForFile: (file) => {
    if (!file) return get().request.crop;
    return get().request.perFileCrops[file.path] ?? getDefaultCropForFile(file);
  },

  setCropEnabled: (enabled) => {
    const selectedPath = get().selectedCropPath;
    if (selectedPath) return get().setCropEnabledForPath(selectedPath, enabled);
    set((state) => ({ request: { ...state.request, crop: { ...state.request.crop, enabled } } }));
  },

  setCropEnabledForPath: (path, enabled) => {
    const file = get().request.inputFiles.find((item) => item.path === path);
    const current = get().request.perFileCrops[path] ?? getDefaultCropForFile(file);
    set((state) => ({
      request: {
        ...state.request,
        crop: state.selectedCropPath === path ? { ...current, enabled } : state.request.crop,
        perFileCrops: { ...state.request.perFileCrops, [path]: { ...current, enabled } },
=======
  setTargetFormat: (format) => {
    set((state) => ({
      request: {
        ...state.request,
        targetFormat: format,
      },
    }));
  },

  setQuality: (quality) => {
    const safeQuality = Math.max(0, Math.min(100, quality));

    set((state) => ({
      request: {
        ...state.request,
        quality: safeQuality,
      },
    }));
  },

  setCompression: (compression) => {
    set((state) => ({
      request: {
        ...state.request,
        compression,
      },
    }));
  },

  setResizeWidth: (width) => {
    set((state) => ({
      request: {
        ...state.request,
        resize: {
          ...state.request.resize,
          width,
        },
      },
    }));
  },

  setResizeHeight: (height) => {
    set((state) => ({
      request: {
        ...state.request,
        resize: {
          ...state.request.resize,
          height,
        },
      },
    }));
  },

  setResizeMode: (mode) => {
    set((state) => ({
      request: {
        ...state.request,
        resize: {
          ...state.request.resize,
          mode,
        },
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
      },
    }));
  },

<<<<<<< HEAD
  setCropPixels: (crop, reference) => {
    const selectedPath = get().selectedCropPath ?? reference?.path;
    if (selectedPath) return get().setCropPixelsForPath(selectedPath, crop, reference);
    set((state) => ({ request: { ...state.request, crop: cropWithPixels(state.request.crop, crop, reference) } }));
  },

  setCropPixelsForPath: (path, crop, reference) => {
    const file = reference ?? get().request.inputFiles.find((item) => item.path === path);
    const current = get().request.perFileCrops[path] ?? getDefaultCropForFile(file);
    const nextCrop = cropWithPixels(current, crop, file);
    set((state) => ({
      request: {
        ...state.request,
        crop: state.selectedCropPath === path ? nextCrop : state.request.crop,
        perFileCrops: { ...state.request.perFileCrops, [path]: nextCrop },
=======
  setResizeEnabled: (enabled) => {
    set((state) => ({
      request: {
        ...state.request,
        resize: {
          ...state.request.resize,
          enabled,
        },
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
      },
    }));
  },

<<<<<<< HEAD
  setCropUnit: (unit) => set((state) => ({ request: { ...state.request, crop: { ...state.request.crop, unit } } })),
  setCropZoom: (zoom) => set((state) => ({ request: { ...state.request, crop: { ...state.request.crop, zoom } } })),

  setCropAspect: (aspect) => {
    const selectedPath = get().selectedCropPath;
    if (selectedPath) return get().setCropAspectForPath(selectedPath, aspect);
    set((state) => ({ request: { ...state.request, crop: { ...state.request.crop, aspect } } }));
  },

  setCropAspectForPath: (path, aspect) => {
    const file = get().request.inputFiles.find((item) => item.path === path);
    const current = get().request.perFileCrops[path] ?? getDefaultCropForFile(file);
    const nextCrop = { ...current, aspect };
    set((state) => ({
      request: {
        ...state.request,
        crop: state.selectedCropPath === path ? nextCrop : state.request.crop,
        perFileCrops: { ...state.request.perFileCrops, [path]: nextCrop },
=======
  setMetadataFlag: (key, value) => {
    set((state) => ({
      request: {
        ...state.request,
        metadata: {
          ...state.request.metadata,
          [key]: value,
        },
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
      },
    }));
  },

<<<<<<< HEAD
  resetCropToImage: () => {
    const selectedPath = get().selectedCropPath;
    if (selectedPath) return get().resetCropForPath(selectedPath);
    const file = get().request.inputFiles[0];
    set((state) => ({ request: { ...state.request, crop: { ...getDefaultCropForFile(file), enabled: state.request.crop.enabled } } }));
  },

  resetCropForPath: (path) => {
    const file = get().request.inputFiles.find((item) => item.path === path);
    const current = get().request.perFileCrops[path] ?? getDefaultCropForFile(file);
    const nextCrop = { ...getDefaultCropForFile(file), enabled: current.enabled, aspect: current.aspect };
    set((state) => ({
      request: {
        ...state.request,
        crop: state.selectedCropPath === path ? nextCrop : state.request.crop,
        perFileCrops: { ...state.request.perFileCrops, [path]: nextCrop },
=======
  setMetadataWriteField: (key, value) => {
    set((state) => ({
      request: {
        ...state.request,
        metadataWrite: {
          ...state.request.metadataWrite,
          [key]: value,
        },
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
      },
    }));
  },

<<<<<<< HEAD
  applySelectedCropToAll: () => {
    const selectedPath = get().selectedCropPath;
    if (!selectedPath) return;
    const selectedCrop = get().request.perFileCrops[selectedPath];
    if (!selectedCrop) return;
    set((state) => {
      const perFileCrops: Record<string, CropOptions> = {};
      for (const file of state.request.inputFiles) {
        const current = state.request.perFileCrops[file.path] ?? getDefaultCropForFile(file);
        perFileCrops[file.path] = {
          ...current,
          enabled: selectedCrop.enabled,
          unit: "percent",
          relativeX: selectedCrop.relativeX,
          relativeY: selectedCrop.relativeY,
          relativeWidth: selectedCrop.relativeWidth,
          relativeHeight: selectedCrop.relativeHeight,
          x: current.x,
          y: current.y,
          width: current.width,
          height: current.height,
          aspect: selectedCrop.aspect,
        };
      }
      return { request: { ...state.request, crop: selectedCrop, perFileCrops } };
    });
  },

  setOutputOverwrite: (overwrite) => set((state) => ({ request: { ...state.request, output: { ...state.request.output, overwrite } } })),
  setUseSourceDirectory: (enabled) => set((state) => ({ request: { ...state.request, output: { ...state.request.output, useSourceDirectory: enabled } } })),
  setOutputDirectory: (directory) => {
    set((state) => ({
      request: { ...state.request, output: { ...state.request.output, directory, useSourceDirectory: directory ? false : state.request.output.useSourceDirectory } },
    }));
  },

  setMetadataFlag: (key, value) => set((state) => ({ request: { ...state.request, metadata: { ...state.request.metadata, [key]: value } } })),
  setMetadataWriteField: (key, value) => set((state) => ({ request: { ...state.request, writeMetadata: { ...state.request.writeMetadata, [key]: value } } })),

  refreshPreview: async () => {
    const request = get().request;
    if (request.inputFiles.length === 0) {
      set({ preview: null, previewError: null });
      return;
    }
    try {
      const preview = await getCommandPreview(request);
      set({ preview, previewError: null });
    } catch (error) {
      set({ preview: null, previewError: getErrorMessage(error) });
=======
  setOverwrite: (overwrite) => {
    set((state) => ({
      request: {
        ...state.request,
        output: {
          ...state.request.output,
          overwrite,
        },
      },
    }));
  },

  refreshPreview: async () => {
    if (get().request.inputFiles.length === 0) {
      set({
        preview: null,
        previewError: "Select or drop an image to generate command preview.",
      });
      return;
    }

    try {
      const preview = await getCommandPreview(get().request);
      set({
        preview,
        previewError: null,
      });
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to generate command preview.";

      set({
        preview: null,
        previewError: message,
      });
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
    }
  },

  execute: async () => {
<<<<<<< HEAD
    const request = get().request;
    if (request.inputFiles.length === 0) {
      set({ runError: "Please add at least one image first." });
      return;
    }
    try {
      set({ isRunning: true, runError: null, runSummary: null, currentFile: null, currentIndex: 0 });
      await startQueue(request);
    } catch (error) {
      set({ isRunning: false, runError: getErrorMessage(error) });
    }
  },

  queueStarted: (event) => set({
    isRunning: true,
    currentIndex: 0,
    currentFile: null,
    runSummary: { total: event.total, succeeded: 0, failed: 0, entries: [] },
  }),

  queueProgress: (event) => set({ currentIndex: event.currentIndex, currentFile: event.input }),

  queueItemFinished: (event) => {
    set((state) => {
      const previous = state.runSummary ?? { total: state.request.inputFiles.length, succeeded: 0, failed: 0, entries: [] };
      return {
        runSummary: {
          total: previous.total,
          succeeded: previous.succeeded + (event.entry.success ? 1 : 0),
          failed: previous.failed + (event.entry.success ? 0 : 1),
          entries: [...previous.entries, event.entry],
        },
      };
    });
  },

  queueFinished: (event) => set({
    isRunning: false,
    currentFile: null,
    currentIndex: event.summary.total,
    runSummary: event.summary,
  }),
}));

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Unknown error.";
}
=======
    if (get().request.inputFiles.length === 0) {
      set({
        runError: "No image selected.",
      });
      return;
    }

    if (get().isRunning) {
      return;
    }

    set({
      isRunning: true,
      runError: null,
      runSummary: {
        total: get().request.inputFiles.length,
        completed: 0,
        failed: 0,
        entries: [],
      },
      currentFile: null,
      currentIndex: 0,
    });

    try {
      await startQueue(get().request);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to start queue.";

      set({
        runError: message,
        isRunning: false,
      });
    }
  },

  queueStarted: (total) => {
    set({
      isRunning: true,
      runError: null,
      runSummary: {
        total,
        completed: 0,
        failed: 0,
        entries: [],
      },
    });
  },

  queueProgress: (payload) => {
    set({
      currentFile: payload.fileName,
      currentIndex: payload.index + 1,
      runSummary: {
        total: payload.total,
        completed: payload.completed,
        failed: payload.failed,
        entries: get().runSummary?.entries ?? [],
      },
    });
  },

  queueItemFinished: (payload) => {
    const previousEntries = get().runSummary?.entries ?? [];

    set({
      runSummary: {
        total: payload.total,
        completed: payload.completed,
        failed: payload.failed,
        entries: [...previousEntries, payload.entry],
      },
    });
  },

  queueFinished: (payload) => {
    set({
      isRunning: false,
      currentFile: null,
      currentIndex: payload.total,
      runSummary: {
        total: payload.total,
        completed: payload.completed,
        failed: payload.failed,
        entries: get().runSummary?.entries ?? [],
      },
    });
  },
}));
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
