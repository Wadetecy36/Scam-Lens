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
  return (
    <AnalysisInputPage type="message" title="Paste the message" description="Include the whole message if you can. ScamLens looks at the wording, pressure, requests, and links it contains." getInput={getInput} disabled={invalid}>
      <TextAreaField label="Message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the suspicious message here…" rows={10} maxLength={10000} hint={`${text.length}/10,000 characters`} error={text.length > 0 && text.trim().length < 10 ? "Add a little more of the message so we have enough context." : undefined} />
    </AnalysisInputPage>
  );
}
