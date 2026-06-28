import { useEffect, useState } from "react";
import { FolderOpen, ImagePlus, UploadCloud, X } from "lucide-react";
import { pickImageFiles, pickInputFolder } from "@/lib/fileSelection";
import { resolveInputPaths } from "@/lib/tauri";
import { useToolkitStore } from "@/stores/useToolkitStore";

export function InputPanel() {
  const setFiles = useToolkitStore((state) => state.setFiles);
  const clearFiles = useToolkitStore((state) => state.clearFiles);

  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePickImages() {
    try {
      setError(null);
      const files = await pickImageFiles();

      if (files.length > 0) {
        setFiles(files);
      }
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Failed to pick images."));
    }
  }

  async function handlePickFolder() {
    try {
      setError(null);
      const files = await pickInputFolder();

      if (files.length > 0) {
        setFiles(files);
      }
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Failed to pick folder."));
    }
  }

  useEffect(() => {
    if (!isTauriRuntime()) {
      setError("Drag & drop works inside the Tauri desktop window.");
      return;
    }

    let cleanup: (() => void) | undefined;

    async function registerDragDrop() {
      try {
        const { getCurrentWebview } = await import("@tauri-apps/api/webview");
        const webview = getCurrentWebview();

        cleanup = await webview.onDragDropEvent(async (event) => {
          if (event.payload.type === "over") {
            setIsDragOver(true);
            return;
          }

          if (event.payload.type === "drop") {
            setIsDragOver(false);
            setError(null);

            try {
              const files = await resolveInputPaths(event.payload.paths);

              if (files.length > 0) {
                setFiles(files);
              } else {
                setError("No supported image files found in dropped items.");
              }
            } catch (caughtError) {
              setError(
                getErrorMessage(caughtError, "Failed to read dropped files."),
              );
            }

            return;
          }

          setIsDragOver(false);
        });
      } catch (caughtError) {
        setError(getErrorMessage(caughtError, "Drag & drop is not available."));
      }
    }

    void registerDragDrop();

    return () => {
      cleanup?.();
    };
  }, [setFiles]);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-medium">Input</h2>

      <div
        className={[
          "mt-4 rounded-xl border border-dashed p-6 text-center transition",
          isDragOver
            ? "border-emerald-400 bg-emerald-400/10"
            : "border-zinc-700 bg-zinc-950",
        ].join(" ")}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-zinc-400" />
        <p className="mt-3 text-sm font-medium">
          Drag & drop images or folders here
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          PNG, JPEG, WebP, AVIF, TIFF, BMP, GIF, ICO
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={handlePickImages}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
        >
          <ImagePlus className="h-4 w-4" />
          Select images
        </button>

        <button
          type="button"
          onClick={handlePickFolder}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-900"
        >
          <FolderOpen className="h-4 w-4" />
          Select folder
        </button>

        <button
          type="button"
          onClick={clearFiles}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-950"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      </div>
    </section>
  );
}

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
