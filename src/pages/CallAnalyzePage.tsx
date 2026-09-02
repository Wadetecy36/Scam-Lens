import { useState } from "react";
import { TextAreaField } from "@/components/ui/Field";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

export function CallAnalyzePage() {
  useDocumentHead({ title: "Describe a call", description: "Tell ScamLens what someone said or asked you to do during a suspicious call.", path: "/analyze/call" });
  const [text, setText] = useState("");
  const invalid = text.trim().length < 10 || text.length > 10000;
  const getInput = (): ScamAnalysisInput => ({ type: "call", text: text.trim() });
  return (
    <AnalysisInputPage type="call" title="What happened?" description="Tell us what the caller said, what they asked for, and anything that made you uncomfortable. Don't include passwords, PINs, or OTPs." getInput={getInput} disabled={invalid}>
      <TextAreaField label="Describe the call" value={text} onChange={(e) => setText(e.target.value)} placeholder="For example: Someone called saying they were from my bank and asked for my OTP…" rows={10} maxLength={10000} hint={`${text.length}/10,000 characters`} error={text.length > 0 && text.trim().length < 10 ? "Add a little more detail so we have enough context." : undefined} />
    </AnalysisInputPage>
  );
}
