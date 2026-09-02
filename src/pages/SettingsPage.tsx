import { useState } from "react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { Card } from "@/components/ui/Card";

export function SettingsPage() {
  useDocumentHead({ title: "Settings", description: "Manage basic ScamLens preferences on this device.", path: "/settings" });
  const [voice, setVoice] = useState(true);
  return <main className="container-page py-10 sm:py-14"><h1 className="mt-1 font-display text-4xl">Settings</h1><p className="mt-4 text-ink-soft">Keep ScamLens comfortable to use. These preferences are local to this browser in Phase 1.</p><div className="mt-8 space-y-3"><Card><div className="flex items-center justify-between gap-4"><div><p className="font-medium">Read-aloud controls</p><p className="mt-1 text-sm text-ink-soft">Show the voice option on analysis results.</p></div><button type="button" role="switch" aria-checked={voice} onClick={() => setVoice(!voice)} className={`tap-target rounded-full px-4 py-2 text-sm font-medium ${voice ? "bg-pine text-paper" : "bg-ink/10 text-ink-soft"}`}>{voice ? "On" : "Off"}</button></div></Card><Card><p className="font-medium">Saved history</p><p className="mt-1 text-sm text-ink-soft">Saved checks are stored as metadata in this browser and expire after 30 days.</p></Card></div></main>;
}
