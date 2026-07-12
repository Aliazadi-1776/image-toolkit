import { useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { Copy, FolderOpen } from "lucide-react";
import { convertFileSrc } from "@/lib/tauri";
import { useToolkitStore } from "@/stores/useToolkitStore";
import type { CompressionMode, ImageFile, ResizeMode, TargetFormat } from "@/types/toolkit";

const formats: TargetFormat[] = ["webp", "avif", "png", "jpeg", "tiff", "bmp", "gif", "ico"];

const resizeModes: Array<{ value: ResizeMode; label: string }> = [
  { value: "fit", label: "Fit" },
  { value: "fill", label: "Fill / exact" },
  { value: "stretch", label: "Stretch" },
];

export function BasicOptions() {
  const request = useToolkitStore((state) => state.request);
  const selectedOptionsPath = useToolkitStore((state) => state.selectedOptionsPath);
  const setSelectedOptionsPath = useToolkitStore((state) => state.setSelectedOptionsPath);
  const getOptionsForFile = useToolkitStore((state) => state.getOptionsForFile);
  const applySelectedOptionsToAll = useToolkitStore((state) => state.applySelectedOptionsToAll);
  const setTargetFormat = useToolkitStore((state) => state.setTargetFormat);
  const setCompression = useToolkitStore((state) => state.setCompression);
  const setQuality = useToolkitStore((state) => state.setQuality);
  const setResizeEnabled = useToolkitStore((state) => state.setResizeEnabled);
  const setResizeWidth = useToolkitStore((state) => state.setResizeWidth);
  const setResizeHeight = useToolkitStore((state) => state.setResizeHeight);
  const setResizeMode = useToolkitStore((state) => state.setResizeMode);
  const setOutputOverwrite = useToolkitStore((state) => state.setOutputOverwrite);
  const setUseSourceDirectory = useToolkitStore((state) => state.setUseSourceDirectory);
  const setOutputDirectory = useToolkitStore((state) => state.setOutputDirectory);

  const selectedFile =
    request.inputFiles.find((file) => file.path === selectedOptionsPath) ?? request.inputFiles[0];

  const selectedOptions = getOptionsForFile(selectedFile);

  useEffect(() => {
    if (!selectedOptionsPath && request.inputFiles[0]) {
      setSelectedOptionsPath(request.inputFiles[0].path);
    }
  }, [request.inputFiles, selectedOptionsPath, setSelectedOptionsPath]);

  async function chooseOutputFolder() {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected === "string") {
      setOutputDirectory(selected);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-4">
        <h2 className="text-lg font-semibold">Convert</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Select an image from the right side and set format, quality and resize for that image only.
        </p>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5 p-4">
          {selectedFile ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-zinc-500">Selected image settings</div>
                  <div className="mt-1 truncate text-lg font-semibold text-zinc-100">
                    {selectedFile.fileName}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {selectedFile.width && selectedFile.height
                      ? `${selectedFile.width} × ${selectedFile.height}`
                      : "Unknown size"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applySelectedOptionsToAll}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  <Copy className="h-4 w-4" />
                  Apply selected settings to all
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Format</span>
                  <select
                    value={selectedOptions.targetFormat}
                    onChange={(event) => setTargetFormat(event.target.value as TargetFormat)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  >
                    {formats.map((format) => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Compression</span>
                  <select
                    value={selectedOptions.compression}
                    onChange={(event) => setCompression(event.target.value as CompressionMode)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="lossy">Lossy</option>
                    <option value="lossless">Lossless</option>
                  </select>
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm text-zinc-300">Quality: {selectedOptions.quality}</span>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={selectedOptions.quality}
                    onChange={(event) => setQuality(Number(event.target.value))}
                    className="w-full"
                  />
                </label>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={selectedOptions.resize.enabled}
                    onChange={(event) => setResizeEnabled(event.target.checked)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  Enable resize for selected image
                </label>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-400">Width</span>
                    <input
                      type="number"
                      min={1}
                      value={selectedOptions.resize.width ?? ""}
                      onChange={(event) => setResizeWidth(event.target.value ? Number(event.target.value) : null)}
                      placeholder="auto"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-zinc-400">Height</span>
                    <input
                      type="number"
                      min={1}
                      value={selectedOptions.resize.height ?? ""}
                      onChange={(event) => setResizeHeight(event.target.value ? Number(event.target.value) : null)}
                      placeholder="auto"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-zinc-400">Mode</span>
                    <select
                      value={selectedOptions.resize.mode}
                      onChange={(event) => setResizeMode(event.target.value as ResizeMode)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    >
                      {resizeModes.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="text-base font-semibold text-zinc-100">No image selected</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Add images first, then select each image to customize its output settings.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <h3 className="text-sm font-medium text-zinc-200">Output destination</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Destination is shared for the whole batch. Image-specific settings are above.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={request.output.useSourceDirectory}
                  onChange={(event) => setUseSourceDirectory(event.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                Save next to original file
              </label>

              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={request.output.overwrite}
                  onChange={(event) => setOutputOverwrite(event.target.checked)}
                  className="h-4 w-4 accent-red-500"
                />
                Overwrite original file
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
              <button
                type="button"
                onClick={chooseOutputFolder}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                <FolderOpen className="h-4 w-4" />
                Choose output folder
              </button>

              {request.output.directory && (
                <button
                  type="button"
                  onClick={() => setOutputDirectory(null)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100"
                >
                  Clear folder
                </button>
              )}
            </div>

            {request.output.directory && (
              <div className="mt-3 truncate rounded-lg bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
                {request.output.directory}
              </div>
            )}
          </div>
        </div>

        <aside className="border-t border-zinc-800 bg-zinc-950 p-4 xl:border-l xl:border-t-0">
          <div className="mb-3">
            <div className="text-sm font-medium text-zinc-200">Images</div>
            <div className="text-xs text-zinc-500">
              Choose one image and edit only its conversion settings.
            </div>
          </div>

          <div className="grid max-h-[620px] grid-cols-2 gap-2 overflow-auto pr-1">
            {request.inputFiles.map((file: ImageFile, index: number) => {
              const options = getOptionsForFile(file);
              const active = selectedFile?.path === file.path;

              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedOptionsPath(file.path)}
                  className={[
                    "group relative overflow-hidden rounded-xl border bg-black text-left transition",
                    active ? "border-emerald-400 ring-2 ring-emerald-500/30" : "border-zinc-800 hover:border-zinc-600",
                  ].join(" ")}
                  title={file.fileName}
                >
                  <img
                    src={convertFileSrc(file.path)}
                    alt={file.fileName}
                    className="h-28 w-full object-cover opacity-90 transition group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-zinc-200">
                    {index + 1}
                  </div>
                  <div className="absolute right-1 top-1 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-950">
                    {options.targetFormat.toUpperCase()}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-black/75 px-1.5 py-1">
                    <div className="truncate text-[10px] text-zinc-200">{file.fileName}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-400">
                      <span>Q{options.quality}</span>
                      {options.resize.enabled && (
                        <span>
                          · {options.resize.width || "auto"}×{options.resize.height || "auto"}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
