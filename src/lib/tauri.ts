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
