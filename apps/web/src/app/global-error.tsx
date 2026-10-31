"use client";

import { Button } from "@repo/ui/atoms/button";

// Rendered when the root layout itself fails, so it cannot use providers or translations.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <h1>Something went wrong</h1>
        <Button onClick={reset}>Try again</Button>
      </body>
    </html>
  );
}
