import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useReadAloud } from "@/hooks/useReadAloud";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

interface ReadAloudButtonProps {
  text: string;
  className?: string;
}

export function ReadAloudButton({ text, className }: ReadAloudButtonProps) {
  const { status, play, pause, stop } = useReadAloud(text);

  if (status === "unsupported") return null;

  const handlePlay = () => {
    track("read_aloud_used");
    play();
  };

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white/70 p-1", className)}>
      {status === "playing" ? (
        <button
          type="button"
          onClick={pause}
          aria-label="Pause reading"
          className="tap-target flex items-center justify-center rounded-full px-3 text-pine"
        >
          <Pause aria-hidden="true" size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={status === "paused" ? "Resume reading aloud" : "Read aloud"}
          className="tap-target flex items-center justify-center gap-1.5 rounded-full px-3 text-pine"
        >
          {status === "paused" ? <Play aria-hidden="true" size={18} /> : <Volume2 aria-hidden="true" size={18} />}
          <span className="text-sm font-medium">Read aloud</span>
        </button>
      )}
      {status !== "idle" && (
        <button
          type="button"
          onClick={stop}
          aria-label="Stop reading"
          className="tap-target flex items-center justify-center rounded-full px-3 text-ink-soft"
        >
          <Square aria-hidden="true" size={14} />
        </button>
      )}
    </div>
  );
}
