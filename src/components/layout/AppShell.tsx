import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 bg-zinc-900/70 px-6 py-4">
        <h1 className="text-xl font-semibold">Image Toolkit</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Transparent GUI for ImageMagick, cwebp and avifenc.
        </p>
      </header>

      <div className="flex-1 p-6">{children}</div>

      <footer className="border-t border-zinc-800 bg-zinc-900/70 px-6 py-4">
        <div className="flex flex-col gap-1 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Built by <span className="font-medium text-zinc-300">wrench</span>
          </span>

          <a
            href="https://virapeak.ir"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-emerald-300 hover:text-emerald-200"
          >
            virapeak.ir
          </a>
        </div>
      </footer>
    </main>
  );
}
