import { useCallback, useEffect, useRef, useState } from "react";

type ReadAloudStatus = "idle" | "playing" | "paused" | "unsupported";

/**
 * Wraps the browser-native SpeechSynthesis API. Never speaks automatically —
 * playback only ever starts from an explicit user action (play()).
 */
export function useReadAloud(text: string) {
  const [status, setStatus] = useState<ReadAloudStatus>(() =>
    typeof window !== "undefined" && "speechSynthesis" in window ? "idle" : "unsupported",
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const play = useCallback(() => {
    if (status === "unsupported") return;
    const synth = window.speechSynthesis;

    if (status === "paused") {
      synth.resume();
      setStatus("playing");
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    utteranceRef.current = utterance;
    synth.speak(utterance);
    setStatus("playing");
  }, [status, text]);

  const pause = useCallback(() => {
    if (status !== "playing") return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [status]);

  const stop = useCallback(() => {
    if (status === "unsupported") return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, [status]);

  return { status, play, pause, stop };
}
