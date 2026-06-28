import { useEffect } from "react";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { InputPanel } from "@/components/input/InputPanel";
import { FileList } from "@/components/files/FileList";
import { BasicOptions } from "@/components/options/BasicOptions";
import { MetadataOptionsPanel } from "@/components/options/MetadataOptionsPanel";
import { CommandPreview } from "@/components/command-preview/CommandPreview";
import { RunPanel } from "@/components/run/RunPanel";
import { LogPanel } from "@/components/logs/LogPanel";
import { ToolStatusPanel } from "@/components/tools/ToolStatusPanel";
import { useQueueEvents } from "@/hooks/useQueueEvents";
import { useToolkitStore } from "@/stores/useToolkitStore";

function ImageToolkitApp() {
  useQueueEvents();

  const request = useToolkitStore((state) => state.request);
  const refreshPreview = useToolkitStore((state) => state.refreshPreview);

  useEffect(() => {
    void refreshPreview();
  }, [request, refreshPreview]);

  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <InputPanel />
          <FileList />
          <CommandPreview />
          <ToolStatusPanel />
          <RunPanel />
        </div>

        <div className="space-y-4">
          <BasicOptions />
          <MetadataOptionsPanel />
          <LogPanel />
        </div>
      </div>
    </AppShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ImageToolkitApp />
    </ErrorBoundary>
  );
}
