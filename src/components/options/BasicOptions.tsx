import { useToolkitStore } from "@/stores/useToolkitStore";
import type { TargetFormat } from "@/types/toolkit";

const formats: TargetFormat[] = [
  "WebP",
  "Avif",
  "Png",
  "Jpeg",
  "Tiff",
  "Bmp",
  "Gif",
  "Ico",
];

export function BasicOptions() {
  const request = useToolkitStore((state) => state.request);
  const setTargetFormat = useToolkitStore((state) => state.setTargetFormat);
  const setQuality = useToolkitStore((state) => state.setQuality);
  const setResizeWidth = useToolkitStore((state) => state.setResizeWidth);
  const setResizeHeight = useToolkitStore((state) => state.setResizeHeight);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-medium">Basic options</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-zinc-400">Format</span>
          <select
            value={request.targetFormat}
            onChange={(event) =>
              setTargetFormat(event.target.value as TargetFormat)
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          >
            {formats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-zinc-400">Quality</span>
          <input
            type="number"
            min={0}
            max={100}
            value={request.quality}
            onChange={(event) => setQuality(Number(event.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-zinc-400">Width</span>
          <input
            type="number"
            value={request.resize.width ?? ""}
            onChange={(event) =>
              setResizeWidth(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-zinc-400">Height</span>
          <input
            type="number"
            value={request.resize.height ?? ""}
            onChange={(event) =>
              setResizeHeight(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          />
        </label>
      </div>
    </section>
  );
}
