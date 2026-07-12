import { Play } from "lucide-react";
import { useToolkitStore } from "@/stores/useToolkitStore";
<<<<<<< HEAD
export function RunPanel(){ const execute=useToolkitStore((s)=>s.execute); const isRunning=useToolkitStore((s)=>s.isRunning); const currentFile=useToolkitStore((s)=>s.currentFile); const currentIndex=useToolkitStore((s)=>s.currentIndex); const runSummary=useToolkitStore((s)=>s.runSummary); const runError=useToolkitStore((s)=>s.runError); const total=runSummary?.total??0; const percent=total>0?Math.round((currentIndex/total)*100):0; return <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold">Queue</h2><p className="mt-1 text-sm text-zinc-400">Run conversion, crop, resize and metadata tasks.</p></div><button type="button" disabled={isRunning} onClick={()=>void execute()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"><Play className="h-4 w-4"/>{isRunning?"Running...":"Run"}</button></div>{runError&&<div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">{runError}</div>}{runSummary&&<div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4"><div className="flex items-center justify-between text-sm text-zinc-300"><span>{currentIndex} / {runSummary.total}</span><span>{percent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{width:`${percent}%`}}/></div>{currentFile&&<div className="mt-3 truncate text-xs text-zinc-500">{currentFile}</div>}<div className="mt-4 grid gap-3 md:grid-cols-3"><SummaryBox label="Total" value={runSummary.total}/><SummaryBox label="Succeeded" value={runSummary.succeeded}/><SummaryBox label="Failed" value={runSummary.failed}/></div></div>}</section>; }
function SummaryBox({label,value}:{label:string;value:number}){ return <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"><div className="text-xs text-zinc-500">{label}</div><div className="mt-1 text-lg font-semibold text-zinc-100">{value}</div></div>; }
=======

export function RunPanel() {
  const isRunning = useToolkitStore((state) => state.isRunning);
  const currentFile = useToolkitStore((state) => state.currentFile);
  const currentIndex = useToolkitStore((state) => state.currentIndex);
  const runSummary = useToolkitStore((state) => state.runSummary);
  const runError = useToolkitStore((state) => state.runError);
  const execute = useToolkitStore((state) => state.execute);

  const total = runSummary?.total ?? 0;
  const completed = runSummary?.completed ?? 0;
  const failed = runSummary?.failed ?? 0;
  const processed = completed + failed;
  const progress = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-medium">Queue</h2>

      <button
        type="button"
        disabled={isRunning}
        onClick={() => void execute()}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Play className="h-4 w-4" />
        {isRunning ? "Processing queue..." : "Start queue"}
      </button>

      {runError && (
        <div className="mt-3 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {runError}
        </div>
      )}

      {runSummary && (
        <>
          <div className="mt-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-2 rounded-full bg-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-zinc-400">
            <span>{progress}%</span>
            <span>
              {processed}/{total}
            </span>
          </div>

          {isRunning && currentFile && (
            <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
              Processing {currentIndex}/{total}:{" "}
              <span className="text-emerald-300">{currentFile}</span>
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
              <div className="text-zinc-500">Total</div>
              <div className="mt-1 font-semibold">{total}</div>
            </div>

            <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-2">
              <div className="text-emerald-400">Done</div>
              <div className="mt-1 font-semibold">{completed}</div>
            </div>

            <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-2">
              <div className="text-red-400">Failed</div>
              <div className="mt-1 font-semibold">{failed}</div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
