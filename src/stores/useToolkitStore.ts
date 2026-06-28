import { create } from "zustand";
import type {
  CommandPreview,
  CompressionMode,
  ImageFile,
  MetadataOptions,
  MetadataWriteOptions,
  OperationRequest,
  ResizeMode,
  RunLogEntry,
  RunSummary,
  TargetFormat,
  ToolPaths,
} from "@/types/toolkit";
import { getCommandPreview, startQueue } from "@/lib/tauri";

interface ToolkitState {
  request: OperationRequest;
  preview: CommandPreview | null;
  previewError: string | null;

  isRunning: boolean;
  currentFile: string | null;
  currentIndex: number;
  runSummary: RunSummary | null;
  runError: string | null;

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
    author: "",
    creator: "",
    description: "",
    keywords: "",
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
  tools: {
    magick: "magick",
    cwebp: "cwebp",
    avifenc: "avifenc",
  },
};

export const useToolkitStore = create<ToolkitState>((set, get) => ({
  request: initialRequest,
  preview: null,
  previewError: null,

  isRunning: false,
  currentFile: null,
  currentIndex: 0,
  runSummary: null,
  runError: null,

  setFiles: (files) => {
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
  },

  clearFiles: () => {
    set((state) => ({
      request: {
        ...state.request,
        inputFiles: [],
      },
      preview: null,
      previewError: null,
      runSummary: null,
      runError: null,
      currentFile: null,
      currentIndex: 0,
    }));
  },

  setToolPath: (key, value) => {
    set((state) => ({
      request: {
        ...state.request,
        tools: {
          ...state.request.tools,
          [key]: value,
        },
      },
    }));
  },

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
      },
    }));
  },

  setResizeEnabled: (enabled) => {
    set((state) => ({
      request: {
        ...state.request,
        resize: {
          ...state.request.resize,
          enabled,
        },
      },
    }));
  },

  setMetadataFlag: (key, value) => {
    set((state) => ({
      request: {
        ...state.request,
        metadata: {
          ...state.request.metadata,
          [key]: value,
        },
      },
    }));
  },

  setMetadataWriteField: (key, value) => {
    set((state) => ({
      request: {
        ...state.request,
        metadataWrite: {
          ...state.request.metadataWrite,
          [key]: value,
        },
      },
    }));
  },

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
    }
  },

  execute: async () => {
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
