import { useState } from "react";
import { TextAreaField } from "@/components/ui/Field";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

export function MessageAnalyzePage() {
  useDocumentHead({ title: "Check a message", description: "Paste a suspicious text, WhatsApp message, or email into ScamLens.", path: "/analyze/message" });
  const [text, setText] = useState("");
  const invalid = text.trim().length < 10 || text.length > 10000;
  const getInput = (): ScamAnalysisInput => ({ type: "message", text: text.trim() });
  
  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) setText(clipboardText);
    } catch (e) {
      console.error("Clipboard access denied", e);
    }
  }

  return (
    <AnalysisInputPage type="message" title="Paste the message" description="Include the whole message if you can. ScamLens looks at the wording, pressure, requests, and links it contains." getInput={getInput} disabled={invalid}>
      <div className="mb-4">
        <button type="button" onClick={handlePaste} className="tap-target inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors">
          Paste from clipboard
        </button>
      </div>
      <TextAreaField label="Message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the suspicious message here…" rows={6} maxLength={10000} hint={`${text.length}/10,000 characters`} error={text.length > 0 && text.trim().length < 10 ? "Add a little more of the message so we have enough context." : undefined} />
    </AnalysisInputPage>
  );
}
