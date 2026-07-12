import { useEffect, useMemo, useRef, useState } from "react";
import { Cropper, RectangleStencil, type CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { Check, Copy, Image as ImageIcon, RotateCcw } from "lucide-react";
import { convertFileSrc } from "@/lib/tauri";
import { useToolkitStore } from "@/stores/useToolkitStore";
import type { CropAspect, ImageFile } from "@/types/toolkit";

const aspectLabels: Array<{
  value: CropAspect;
  label: string;
}> = [
  { value: "free", label: "Free" },
  { value: "original", label: "Original" },
  { value: "square", label: "1:1" },
  { value: "fourThree", label: "4:3" },
  { value: "sixteenNine", label: "16:9" },
];

interface DraftCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function makeDraftFromFile(file?: ImageFile | null): DraftCrop {
  return {
    x: 0,
    y: 0,
    width: file?.width || 300,
    height: file?.height || 300,
  };
}

export function CropPanel() {
  const cropperRef = useRef<CropperRef>(null);

  const request = useToolkitStore((state) => state.request);
  const selectedCropPath = useToolkitStore((state) => state.selectedCropPath);
  const setSelectedCropPath = useToolkitStore((state) => state.setSelectedCropPath);
  const getCropForFile = useToolkitStore((state) => state.getCropForFile);
  const setCropEnabledForPath = useToolkitStore((state) => state.setCropEnabledForPath);
  const setCropPixelsForPath = useToolkitStore((state) => state.setCropPixelsForPath);
  const setCropAspectForPath = useToolkitStore((state) => state.setCropAspectForPath);
  const resetCropForPath = useToolkitStore((state) => state.resetCropForPath);
  const applySelectedCropToAll = useToolkitStore((state) => state.applySelectedCropToAll);

  const selectedFile =
    request.inputFiles.find((file) => file.path === selectedCropPath) ?? request.inputFiles[0];

  const selectedCrop = getCropForFile(selectedFile);

  const [draftCrop, setDraftCrop] = useState<DraftCrop>(() =>
    selectedCrop.width > 0
      ? {
          x: selectedCrop.x,
          y: selectedCrop.y,
          width: selectedCrop.width,
          height: selectedCrop.height,
        }
      : makeDraftFromFile(selectedFile),
  );

  const [hasDraftChanges, setHasDraftChanges] = useState(false);

  const imageSrc = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return convertFileSrc(selectedFile.path);
  }, [selectedFile]);

  const aspectRatio = useMemo(() => {
    if (selectedCrop.aspect === "free") {
      return undefined;
    }

    if (selectedCrop.aspect === "square") {
      return 1;
    }

    if (selectedCrop.aspect === "fourThree") {
      return 4 / 3;
    }

    if (selectedCrop.aspect === "sixteenNine") {
      return 16 / 9;
    }

    if (selectedFile?.width && selectedFile?.height) {
      return selectedFile.width / selectedFile.height;
    }

    return undefined;
  }, [selectedCrop.aspect, selectedFile?.height, selectedFile?.width]);

  useEffect(() => {
    if (!selectedCropPath && request.inputFiles[0]) {
      setSelectedCropPath(request.inputFiles[0].path);
    }
  }, [request.inputFiles, selectedCropPath, setSelectedCropPath]);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const crop = getCropForFile(selectedFile);

    setDraftCrop(
      crop.width > 0
        ? {
            x: crop.x,
            y: crop.y,
            width: crop.width,
            height: crop.height,
          }
        : makeDraftFromFile(selectedFile),
    );

    setHasDraftChanges(false);
  }, [selectedFile?.path, getCropForFile]);

  function selectImage(path: string) {
    setSelectedCropPath(path);
  }

  function handleChange(cropper: CropperRef) {
    const coordinates = cropper.getCoordinates();

    if (!coordinates || !selectedFile) {
      return;
    }

    setDraftCrop({
      x: Math.max(0, Math.round(coordinates.left)),
      y: Math.max(0, Math.round(coordinates.top)),
      width: Math.max(1, Math.round(coordinates.width)),
      height: Math.max(1, Math.round(coordinates.height)),
    });

    setHasDraftChanges(true);
  }

  function applyCropToSelectedImage() {
    if (!selectedFile) {
      return;
    }

    setCropPixelsForPath(selectedFile.path, draftCrop, selectedFile);
    setCropEnabledForPath(selectedFile.path, true);
    setHasDraftChanges(false);
  }

  function resetCropper() {
    if (!selectedFile) {
      return;
    }

    resetCropForPath(selectedFile.path);
    cropperRef.current?.reset();
    setDraftCrop(makeDraftFromFile(selectedFile));
    setHasDraftChanges(false);
  }

  if (request.inputFiles.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-lg font-semibold">Crop</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add images first. Then select each image from the list and crop it one by one.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Crop</h2>
            <p className="mt-1 text-sm text-zinc-400">
              First select an image. Then adjust the crop and press Apply. Every image can have its own crop.
            </p>
          </div>

          {selectedFile && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={selectedCrop.enabled}
                  onChange={(event) => setCropEnabledForPath(selectedFile.path, event.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                Crop enabled for this image
              </label>

              <button
                type="button"
                onClick={applyCropToSelectedImage}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  hasDraftChanges
                    ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
                ].join(" ")}
              >
                <Check className="h-4 w-4" />
                Apply crop to selected
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <ImageIcon className="h-4 w-4 text-emerald-400" />
              Select image for crop
            </div>

            <select
              value={selectedFile?.path ?? ""}
              onChange={(event) => selectImage(event.target.value)}
              className="max-w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-emerald-500 md:min-w-80"
            >
              {request.inputFiles.map((file, index) => (
                <option key={file.path} value={file.path}>
                  {index + 1}. {file.fileName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid max-h-36 grid-cols-3 gap-2 overflow-auto pr-1 md:grid-cols-5 xl:grid-cols-8">
            {request.inputFiles.map((file: ImageFile, index: number) => {
              const crop = getCropForFile(file);
              const active = selectedFile?.path === file.path;

              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => selectImage(file.path)}
                  className={[
                    "group relative overflow-hidden rounded-xl border bg-black text-left transition",
                    active
                      ? "border-emerald-400 ring-2 ring-emerald-500/30"
                      : "border-zinc-800 hover:border-zinc-600",
                  ].join(" ")}
                  title={file.fileName}
                >
                  <img
                    src={convertFileSrc(file.path)}
                    alt={file.fileName}
                    className="h-24 w-full object-cover opacity-90 transition group-hover:opacity-100"
                    loading="lazy"
                  />

                  <div className="absolute left-1 top-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-zinc-200">
                    {index + 1}
                  </div>

                  {crop.enabled && (
                    <div className="absolute right-1 top-1 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-950">
                      applied
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 truncate bg-black/75 px-1.5 py-1 text-[10px] text-zinc-300">
                    {file.fileName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
        <div className="bg-black p-3">
          <div className="relative h-[560px] overflow-hidden rounded-xl border border-zinc-800 bg-black">
            {imageSrc && selectedFile ? (
              <Cropper
                key={`${selectedFile.path}-${selectedCrop.aspect}-${selectedCrop.x}-${selectedCrop.y}-${selectedCrop.width}-${selectedCrop.height}`}
                ref={cropperRef}
                src={imageSrc}
                stencilComponent={RectangleStencil}
                stencilProps={{
                  movable: true,
                  resizable: true,
                  aspectRatio,
                }}
                defaultCoordinates={{
                  left: selectedCrop.x || 0,
                  top: selectedCrop.y || 0,
                  width: selectedCrop.width || selectedFile.width || 300,
                  height: selectedCrop.height || selectedFile.height || 300,
                }}
                onChange={handleChange}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                Image preview is not available.
              </div>
            )}
          </div>

          {hasDraftChanges && (
            <div className="mt-3 rounded-xl border border-amber-800/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
              You changed the crop area. Click <b>Apply crop to selected</b> to save it for this image.
            </div>
          )}
        </div>

        <aside className="space-y-4 border-t border-zinc-800 bg-zinc-950 p-4 xl:border-l xl:border-t-0">
          {selectedFile && (
            <>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="text-sm text-zinc-500">Selected image</div>
                <div className="mt-1 truncate text-base font-semibold text-zinc-100">
                  {selectedFile.fileName}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {selectedFile.width && selectedFile.height
                    ? `${selectedFile.width} × ${selectedFile.height}`
                    : "Unknown size"}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="text-sm font-medium text-zinc-200">Aspect ratio</div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {aspectLabels.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCropAspectForPath(selectedFile.path, item.value)}
                      className={[
                        "rounded-lg border px-3 py-2 text-sm transition",
                        selectedCrop.aspect === item.value
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-100",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="text-sm font-medium text-zinc-200">
                  Current draft
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <PixelBox label="X" value={draftCrop.x} />
                  <PixelBox label="Y" value={draftCrop.y} />
                  <PixelBox label="Width" value={draftCrop.width} />
                  <PixelBox label="Height" value={draftCrop.height} />
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xs text-zinc-400">
                Saved crop:
                <div className="mt-2 font-mono text-zinc-300">
                  x {(selectedCrop.relativeX * 100).toFixed(1)}% · y{" "}
                  {(selectedCrop.relativeY * 100).toFixed(1)}%
                  <br />
                  w {(selectedCrop.relativeWidth * 100).toFixed(1)}% · h{" "}
                  {(selectedCrop.relativeHeight * 100).toFixed(1)}%
                </div>
              </div>

              <button
                type="button"
                onClick={applyCropToSelectedImage}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                <Check className="h-4 w-4" />
                Apply crop to selected image
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={applySelectedCropToAll}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  <Copy className="h-4 w-4" />
                  Apply all
                </button>

                <button
                  type="button"
                  onClick={resetCropper}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function PixelBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
      <div className="text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-zinc-200">{value}</div>
    </div>
  );
}
