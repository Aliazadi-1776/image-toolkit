import { useToolkitStore } from "@/stores/useToolkitStore";
<<<<<<< HEAD
export function FileList(){ const files=useToolkitStore((s)=>s.request.inputFiles); if(!files.length) return <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"><h2 className="font-medium">Files</h2><p className="mt-2 text-sm text-zinc-500">No images selected yet.</p></section>; return <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"><div className="flex items-center justify-between gap-3"><h2 className="font-medium">Files</h2><span className="rounded-full bg-zinc-950 px-2 py-1 text-xs text-zinc-400">{files.length} file{files.length>1?"s":""}</span></div><div className="mt-4 max-h-72 space-y-2 overflow-auto pr-1">{files.map((file)=><div key={file.path} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"><div className="truncate text-sm text-zinc-100">{file.fileName}</div><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500"><span>{formatBytes(file.sizeBytes)}</span>{file.width&&file.height&&<span>{file.width} × {file.height}</span>}<span>{file.extension || "unknown"}</span></div><div className="mt-1 truncate text-xs text-zinc-600">{file.path}</div></div>)}</div></section>; }
function formatBytes(bytes:number){ if(!Number.isFinite(bytes)||bytes<=0) return "0 B"; const units=["B","KB","MB","GB"]; const index=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1); return `${(bytes/1024**index).toFixed(index===0?0:1)} ${units[index]}`; }
=======

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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
