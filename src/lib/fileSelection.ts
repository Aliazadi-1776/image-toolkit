<<<<<<< HEAD
import { open } from "@tauri-apps/plugin-dialog";

const filters = [{ name: "Images", extensions: ["jpg", "jpeg", "png", "webp", "avif", "tif", "tiff", "bmp", "gif", "ico"] }];

export async function pickImageFiles(): Promise<string[]> {
  const selected = await open({ multiple: true, directory: false, filters });
  if (!selected) return [];
  return Array.isArray(selected) ? selected : [selected];
}

export async function pickInputFolder(): Promise<string | null> {
  const selected = await open({ multiple: false, directory: true });
  if (!selected || Array.isArray(selected)) return null;
  return selected;
=======
import { resolveInputPaths } from "@/lib/tauri";
import type { ImageFile } from "@/types/toolkit";

const imageFilter = {
  name: "Images",
  extensions: [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
    "tif",
    "tiff",
    "bmp",
    "gif",
    "ico",
  ],
};

export async function pickImageFiles(): Promise<ImageFile[]> {
  ensureTauriRuntime();

  const { open } = await import("@tauri-apps/plugin-dialog");

  const selected = await open({
    multiple: true,
    directory: false,
    filters: [imageFilter],
  });

  return resolveSelection(selected);
}

export async function pickInputFolder(): Promise<ImageFile[]> {
  ensureTauriRuntime();

  const { open } = await import("@tauri-apps/plugin-dialog");

  const selected = await open({
    multiple: false,
    directory: true,
  });

  return resolveSelection(selected);
}

async function resolveSelection(
  selected: string | string[] | null,
): Promise<ImageFile[]> {
  if (!selected) {
    return [];
  }

  const paths = Array.isArray(selected) ? selected : [selected];

  if (paths.length === 0) {
    return [];
  }

  return resolveInputPaths(paths);
}

function ensureTauriRuntime() {
  if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) {
    throw new Error(
      "File picker is only available inside the Tauri desktop window.",
    );
  }
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
}
