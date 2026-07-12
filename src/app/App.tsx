<<<<<<< HEAD
import { useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { Sidebar, type AppView } from "@/components/layout/Sidebar";
=======
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
import { InputPanel } from "@/components/input/InputPanel";
import { FileList } from "@/components/files/FileList";
import { BasicOptions } from "@/components/options/BasicOptions";
import { MetadataOptionsPanel } from "@/components/options/MetadataOptionsPanel";
import { CommandPreview } from "@/components/command-preview/CommandPreview";
import { RunPanel } from "@/components/run/RunPanel";
import { LogPanel } from "@/components/logs/LogPanel";
import { ToolStatusPanel } from "@/components/tools/ToolStatusPanel";
<<<<<<< HEAD
import { CropPanel } from "@/components/crop/CropPanel";
=======
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
import { useQueueEvents } from "@/hooks/useQueueEvents";
import { useToolkitStore } from "@/stores/useToolkitStore";

function ImageToolkitApp() {
  useQueueEvents();
<<<<<<< HEAD
  const [activeView, setActiveView] = useState<AppView>("convert");
  const request = useToolkitStore((s) => s.request); const refreshPreview = useToolkitStore((s) => s.refreshPreview);
  useEffect(() => { void refreshPreview(); }, [request, refreshPreview]);
  return <AppShell><div className="grid gap-4 xl:grid-cols-[280px_1fr]"><Sidebar activeView={activeView} onChange={setActiveView}/><div className="min-w-0 space-y-4">
    {activeView === "convert" && <><InputPanel/><FileList/><BasicOptions/><CommandPreview/></>}
    {activeView === "crop" && <><InputPanel/><CropPanel/><CommandPreview/></>}
    {activeView === "properties" && <><InputPanel/><FileList/><MetadataOptionsPanel/><CommandPreview/></>}
    {activeView === "queue" && <><FileList/><RunPanel/><CommandPreview/></>}
    {activeView === "tools" && <ToolStatusPanel/>}
    {activeView === "logs" && <LogPanel/>}
  </div></div></AppShell>;
}
export default function App(){ return <ErrorBoundary><ImageToolkitApp/></ErrorBoundary>; }
=======

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
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
