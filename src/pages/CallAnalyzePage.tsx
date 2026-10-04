import { useState } from "react";
import { TextAreaField } from "@/components/ui/Field";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

export function CallAnalyzePage() {
  useDocumentHead({
    title: "Describe a call",
    description: "Tell ScamLens what someone said or asked you to do during a suspicious phone call.",
    path: "/analyze/call",
  });
  const [text, setText] = useState("");
  const invalid = text.trim().length < 10 || text.length > 10000;
  const getInput = (): ScamAnalysisInput => ({ type: "call", text: text.trim() });

  return (
    <AnalysisInputPage
      type="call"
      title="What happened on the call?"
      description="Tell us what the caller said, who they claimed to be, and what they asked you to do or approve. Remember: never share your PIN or OTP."
      getInput={getInput}
      disabled={invalid}
    >
      <TextAreaField
        label="Describe the call or conversation"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="For example: Someone called claiming to be from MTN MoMo or my bank. They said my account would be blocked if I didn't approve a prompt on my phone immediately..."
        rows={8}
        maxLength={10000}
        hint={`${text.length}/10,000 characters`}
        error={text.length > 0 && text.trim().length < 10 ? "Add a little more detail so we have enough context to help." : undefined}
      />
    </AnalysisInputPage>
  );
}
