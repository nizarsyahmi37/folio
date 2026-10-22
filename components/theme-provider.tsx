"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";

function ThemeStatusAnnouncer() {
  const { theme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!mounted) return;
    if (theme === "system") {
      setMessage(`Color theme set to system (${resolvedTheme ?? "light"})`);
    } else {
      setMessage(`Color theme set to ${theme}`);
    }
  }, [theme, resolvedTheme, mounted]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeStatusAnnouncer />
      {children}
    </NextThemesProvider>
  );
}
