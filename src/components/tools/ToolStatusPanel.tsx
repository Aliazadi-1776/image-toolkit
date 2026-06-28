import { useEffect, useState } from "react";
import { RefreshCw, Wrench } from "lucide-react";
import { getToolStatuses, type ToolStatus } from "@/lib/tauri";
import { useToolkitStore } from "@/stores/useToolkitStore";

export function ToolStatusPanel() {
  const tools = useToolkitStore((state) => state.request.tools);

  const [statuses, setStatuses] = useState<ToolStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadStatuses() {
    if (!isTauriRuntime()) {
      setError("Tool status is available inside the Tauri desktop window.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getToolStatuses(tools);
      setStatuses(result);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Failed to check tools."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools.magick, tools.cwebp, tools.avifenc]);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          <h2 className="font-medium">Bundled tools</h2>
        </div>

        <button
          type="button"
          onClick={() => void loadStatuses()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-950 disabled:opacity-60"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {statuses.length === 0 && !error ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
            {isLoading ? "Checking tools..." : "No tool status yet."}
          </div>
        ) : (
          statuses.map((status) => {
            const outputText = getStatusOutput(status);

            return (
              <div
                key={status.name}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">{status.name}</div>

                  <span
                    className={[
                      "rounded-full px-2 py-1 text-xs",
                      status.success
                        ? "bg-emerald-950 text-emerald-300"
                        : "bg-red-950 text-red-300",
                    ].join(" ")}
                  >
                    {status.success ? "ready" : "missing"}
                  </span>
                </div>

                <div className="mt-2 text-xs text-zinc-500">
                  Source:{" "}
                  <span className="text-zinc-300">{status.source}</span>
                </div>

                <div className="mt-1 truncate text-xs text-zinc-500">
                  {status.program}
                </div>

                {outputText && (
                  <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-black p-2 text-xs text-zinc-400">
                    {outputText}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function getStatusOutput(status: ToolStatus): string {
  if (status.error) {
    return status.error;
  }

  if (status.stdout) {
    return status.stdout;
  }

  if (status.stderr) {
    return status.stderr;
  }

  return "";
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
