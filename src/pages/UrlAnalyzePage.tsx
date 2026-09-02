import { useState } from "react";
import { InputField } from "@/components/ui/Field";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { isPlausibleUrl } from "@/ai/scam-analysis/validators";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

export function UrlAnalyzePage() {
  useDocumentHead({ title: "Check a link", description: "Check the shape of a suspicious URL with ScamLens before opening it.", path: "/analyze/url" });
  const [url, setUrl] = useState("");
  const invalid = !isPlausibleUrl(url);
  const getInput = (): ScamAnalysisInput => ({ type: "url", url: url.trim() });
  return (
    <AnalysisInputPage type="url" title="Paste the link" description="Paste the URL exactly as you received it. ScamLens will not open the link from your browser in this phase." getInput={getInput} disabled={invalid}>
      <InputField label="URL" type="url" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/..." hint="Only http and https links are accepted." error={url.length > 0 && invalid ? "Enter a complete http:// or https:// link." : undefined} />
    </AnalysisInputPage>
  );
}
