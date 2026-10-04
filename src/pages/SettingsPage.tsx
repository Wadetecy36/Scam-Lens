import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sliders, Volume2, ShieldCheck } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { Card } from "@/components/ui/Card";
import { useUxMode } from "@/hooks/useUxMode";

export function SettingsPage() {
  useDocumentHead({
    title: "Settings",
    description: "Manage basic ScamLens preferences on this device.",
    path: "/settings",
  });
  const [voice, setVoice] = useState(true);
  const { mode, setMode } = useUxMode();

  return (
    <main className="container-page py-10 sm:py-14">
      <Link
        to="/"
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">Settings</h1>
        <p className="mt-2 text-base text-foreground-soft">
          Customize ScamLens to suit your reading style. All preferences remain private on this browser.
        </p>
      </div>

      <div className="mt-8 space-y-4 max-w-2xl">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-icon-bg text-blue">
              <Sliders size={20} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-navy">Result Detail Level</p>
              <p className="mt-1 text-sm text-foreground-soft leading-relaxed">
                Simple mode keeps results short and direct. Detailed mode shows technical scoring and security database checks.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3" role="group" aria-label="Result detail level">
                <button
                  type="button"
                  onClick={() => setMode("simple")}
                  className={`tap-target rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    mode === "simple"
                      ? "bg-blue text-white shadow-xs"
                      : "border border-border bg-surface-secondary text-foreground-soft hover:bg-surface hover:text-navy"
                  }`}
                >
                  Simple
                </button>
                <button
                  type="button"
                  onClick={() => setMode("detailed")}
                  className={`tap-target rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    mode === "detailed"
                      ? "bg-blue text-white shadow-xs"
                      : "border border-border bg-surface-secondary text-foreground-soft hover:bg-surface hover:text-navy"
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-icon-bg text-blue">
                <Volume2 size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-bold text-navy">Read Aloud Voice</p>
                <p className="mt-1 text-sm text-foreground-soft leading-relaxed">
                  Keep the voice audio button available on result reports.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={voice}
              onClick={() => setVoice(!voice)}
              className={`tap-target rounded-full px-5 py-2 text-sm font-bold transition-all ${
                voice
                  ? "bg-blue text-white shadow-xs"
                  : "border border-border bg-surface-secondary text-foreground-soft"
              }`}
            >
              {voice ? "On" : "Off"}
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-icon-bg text-blue">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-bold text-navy">Saved History & Privacy</p>
              <p className="mt-1 text-sm text-foreground-soft leading-relaxed">
                Saved checks contain basic result metadata only and automatically expire after 30 days. No message text is ever uploaded for storage.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
