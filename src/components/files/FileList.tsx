import { useToolkitStore } from "@/stores/useToolkitStore";

export function FileList() {
  const files = useToolkitStore((state) => state.request.inputFiles);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium">Selected files</h2>
        <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
          {files.length}
        </span>
      </div>

      {files.length === 0 ? (
        <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-4 text-sm text-zinc-500">
          No files selected yet.
        </p>
      ) : (
        <div className="mt-4 max-h-72 space-y-2 overflow-auto pr-1">
          {files.map((file) => (
            <div
              key={file.path}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
            >
              <div className="text-sm font-medium">{file.fileName}</div>
              <div className="mt-1 truncate text-xs text-zinc-500">
                {file.path}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
