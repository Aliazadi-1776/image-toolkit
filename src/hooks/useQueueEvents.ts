import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useToolkitStore } from "@/stores/useToolkitStore";
import type { QueueFinishedEvent, QueueItemFinishedEvent, QueueProgressEvent, QueueStartedEvent } from "@/types/toolkit";
export function useQueueEvents() {
  const queueStarted = useToolkitStore((s) => s.queueStarted); const queueProgress = useToolkitStore((s) => s.queueProgress); const queueItemFinished = useToolkitStore((s) => s.queueItemFinished); const queueFinished = useToolkitStore((s) => s.queueFinished);
  useEffect(() => { const fns: Array<() => void> = []; async function setup(){ fns.push(await listen<QueueStartedEvent>("queue-started", e => queueStarted(e.payload))); fns.push(await listen<QueueProgressEvent>("queue-progress", e => queueProgress(e.payload))); fns.push(await listen<QueueItemFinishedEvent>("queue-item-finished", e => queueItemFinished(e.payload))); fns.push(await listen<QueueFinishedEvent>("queue-finished", e => queueFinished(e.payload))); } void setup(); return () => { for (const fn of fns) fn(); }; }, [queueFinished, queueItemFinished, queueProgress, queueStarted]);
}
