<<<<<<< HEAD
import { invoke, convertFileSrc as tauriConvertFileSrc } from "@tauri-apps/api/core";
import type { CommandPreview, ImageFile, OperationRequest, QueueStartResult, ToolStatus } from "@/types/toolkit";

export async function resolveInputPaths(paths: string[]): Promise<ImageFile[]> {
  return invoke<ImageFile[]>("resolve_input_paths", { paths });
}
export async function getCommandPreview(request: OperationRequest): Promise<CommandPreview> {
  return invoke<CommandPreview>("preview_command", { request });
}
export async function startQueue(request: OperationRequest): Promise<QueueStartResult> {
  return invoke<QueueStartResult>("start_queue", { request });
}
export async function getToolStatuses(): Promise<ToolStatus[]> {
  return invoke<ToolStatus[]>("tool_statuses");
}
export function convertFileSrc(path: string): string { return tauriConvertFileSrc(path); }
=======
import { invoke } from "@tauri-apps/api/core";
import type {
  CommandPreview,
  ImageFile,
  OperationRequest,
  QueueStartResult,
  ToolPaths,
} from "@/types/toolkit";

export interface ToolStatus {
  name: string;
  program: string;
  source: string;
  exists: boolean;
  success: boolean;
  versionCommand: string;
  stdout: string;
  stderr: string;
  error?: string | null;
}

export async function getCommandPreview(
  request: OperationRequest,
): Promise<CommandPreview> {
  ensureTauriRuntime();
  return invoke<CommandPreview>("preview_command", { request });
}

export async function resolveInputPaths(paths: string[]): Promise<ImageFile[]> {
  ensureTauriRuntime();
  return invoke<ImageFile[]>("resolve_input_paths", { paths });
}

export async function startQueue(
  request: OperationRequest,
): Promise<QueueStartResult> {
  ensureTauriRuntime();
  return invoke<QueueStartResult>("start_queue", { request });
}

export async function getToolStatuses(
  tools: ToolPaths,
): Promise<ToolStatus[]> {
  ensureTauriRuntime();
  return invoke<ToolStatus[]>("tool_statuses", { tools });
}

export async function healthCheck(): Promise<string> {
  ensureTauriRuntime();
  return invoke<string>("health_check");
}

function ensureTauriRuntime() {
  if (!isTauriRuntime()) {
    throw new Error(
      "Tauri backend is not available. Run the app with `npm run tauri dev`, not only `npm run dev`.",
    );
  }
}

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
