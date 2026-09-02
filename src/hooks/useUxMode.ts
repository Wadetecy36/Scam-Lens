import { useEffect, useState } from "react";

export type UxMode = "simple" | "detailed";

const KEY = "scamlens-ux-mode";

export function useUxMode() {
  const [mode, setModeState] = useState<UxMode>(() => {
    try {
      return localStorage.getItem(KEY) === "detailed"
        ? "detailed"
        : "simple";
    } catch {
      return "simple";
    }
  });

  function setMode(next: UxMode) {
    setModeState(next);

    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Session-only fallback if storage is unavailable.
    }
  }

  useEffect(() => {
    document.documentElement.dataset.scamlensMode = mode;

    return () => {
      delete document.documentElement.dataset.scamlensMode;
    };
  }, [mode]);

  return {
    mode,
    setMode,
    isSimple: mode === "simple",
  };
}
