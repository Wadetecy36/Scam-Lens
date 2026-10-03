import { useState } from "react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { Card } from "@/components/ui/Card";
import { useUxMode } from "@/hooks/useUxMode";

export function SettingsPage() {
  useDocumentHead({ title: "Settings", description: "Manage basic ScamLens preferences on this device.", path: "/settings" });
  const [voice, setVoice] = useState(true);
  const { mode, setMode } = useUxMode();

  return <main className="container-page py-10 sm:py-14">
    <h1 className="mt-1 text-4xl">Settings</h1>
    <p className="mt-4 text-foreground-soft">Keep ScamLens comfortable to use. These preferences stay on this browser.</p>
    <div className="mt-8 space-y-3">
      <Card>
        <p className="font-medium">How much detail do you want?</p>
        <p className="mt-1 text-sm text-foreground-soft">Simple mode keeps results short and easy to act on. Detailed mode shows technical information too.</p>
        <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Result detail level">
          <button type="button" onClick={() => setMode("simple")} className={`tap-target rounded-xl px-3 py-3 text-sm font-medium ${mode === "simple" ? "bg-primary text-background" : "bg-foreground/5 text-foreground-soft"}`}>Simple</button>
          <button type="button" onClick={() => setMode("detailed")} className={`tap-target rounded-xl px-3 py-3 text-sm font-medium ${mode === "detailed" ? "bg-primary text-background" : "bg-foreground/5 text-foreground-soft"}`}>Detailed</button>
        </div>
      </Card>
      <Card><div className="flex items-center justify-between gap-4"><div><p className="font-medium">Read aloud</p><p className="mt-1 text-sm text-foreground-soft">Keep the voice option available on results.</p></div><button type="button" role="switch" aria-checked={voice} onClick={() => setVoice(!voice)} className={`tap-target rounded-full px-4 py-2 text-sm font-medium ${voice ? "bg-primary text-background" : "bg-foreground/10 text-foreground-soft"}`}>{voice ? "On" : "Off"}</button></div></Card>
      <Card><p className="font-medium">Saved history</p><p className="mt-1 text-sm text-foreground-soft">Saved checks contain result metadata only and expire after 30 days.</p></Card>
    </div>
  </main>;
}
