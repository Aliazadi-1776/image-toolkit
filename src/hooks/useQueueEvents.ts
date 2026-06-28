import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useToolkitStore } from "@/stores/useToolkitStore";
import type {
  QueueFinishedEvent,
  QueueItemFinishedEvent,
  QueueProgressEvent,
  QueueStartedEvent,
} from "@/types/toolkit";

export function useQueueEvents() {
  const queueStarted = useToolkitStore((state) => state.queueStarted);
  const queueProgress = useToolkitStore((state) => state.queueProgress);
  const queueItemFinished = useToolkitStore((state) => state.queueItemFinished);
  const queueFinished = useToolkitStore((state) => state.queueFinished);

  useEffect(() => {
    if (!isTauriRuntime()) {
      return;
    }

    const unlisteners: Array<() => void> = [];

    async function registerEvents() {
      const unlistenStarted = await listen<QueueStartedEvent>(
        "queue-started",
        (event) => {
          queueStarted(event.payload.total);
        },
      );

      const unlistenProgress = await listen<QueueProgressEvent>(
        "queue-progress",
        (event) => {
          queueProgress({
            index: event.payload.index,
            total: event.payload.total,
            fileName: event.payload.fileName,
            completed: event.payload.completed,
            failed: event.payload.failed,
          });
        },
      );

      const unlistenItemFinished = await listen<QueueItemFinishedEvent>(
        "queue-item-finished",
        (event) => {
          queueItemFinished({
            entry: event.payload.entry,
            completed: event.payload.completed,
            failed: event.payload.failed,
            total: event.payload.total,
          });
        },
      );

      const unlistenFinished = await listen<QueueFinishedEvent>(
        "queue-finished",
        (event) => {
          queueFinished({
            total: event.payload.total,
            completed: event.payload.completed,
            failed: event.payload.failed,
          });
        },
      );

      unlisteners.push(
        unlistenStarted,
        unlistenProgress,
        unlistenItemFinished,
        unlistenFinished,
      );
    }

    void registerEvents();

    return () => {
      for (const unlisten of unlisteners) {
        unlisten();
      }
    };
  }, [queueStarted, queueProgress, queueItemFinished, queueFinished]);
}

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
