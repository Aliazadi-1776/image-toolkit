import { Terminal } from "lucide-react";
import { useToolkitStore } from "@/stores/useToolkitStore";

export function CommandPreview() {
  const preview = useToolkitStore((state) => state.preview);
  const error = useToolkitStore((state) => state.previewError);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        <h2 className="font-medium">Live command preview</h2>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-800 bg-black p-3">
        {error ? (
          <pre className="whitespace-pre-wrap text-sm text-red-400">
            {error}
          </pre>
        ) : (
          <pre className="whitespace-pre-wrap break-words text-sm text-emerald-300">
            {preview?.command ?? "No command generated yet."}
          </pre>
        )}
      </div>

      {preview?.outputPath && (
        <div className="mt-3 truncate text-xs text-zinc-500">
          Output: {preview.outputPath}
        </div>
      )}
    </section>
  );
}
