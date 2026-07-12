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
}
