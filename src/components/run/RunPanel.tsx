import { Play } from "lucide-react";
import { useToolkitStore } from "@/stores/useToolkitStore";

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
