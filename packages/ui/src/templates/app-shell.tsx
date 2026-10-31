import type { ReactNode } from "react";

/** Page frame with a `header` slot above a centered, full-height main area for `children`. */
export function AppShell({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <main className="max-w-5xl px-4 py-10 mx-auto w-full flex-1">{children}</main>
    </div>
  );
}
