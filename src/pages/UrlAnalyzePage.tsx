import { useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { InputField } from "@/components/ui/Field";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { isPlausibleUrl } from "@/ai/scam-analysis/validators";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

export function UrlAnalyzePage() {
  useDocumentHead({
    title: "Check a link",
    description: "Check the shape and threat status of a suspicious URL with ScamLens before opening it.",
    path: "/analyze/url",
  });
  const [url, setUrl] = useState("");
  const invalid = !isPlausibleUrl(url);
  const getInput = (): ScamAnalysisInput => ({ type: "url", url: url.trim() });

  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) setUrl(clipboardText.trim());
    } catch (e) {
      console.error("Clipboard access denied", e);
    }
  }

  return (
    <AnalysisInputPage
      type="url"
      title="Paste the link"
      description="Paste the website address exactly as you received it. ScamLens will verify it safely without opening the page in your browser."
      getInput={getInput}
      disabled={invalid}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePaste}
          className="tap-target inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-blue hover:text-blue transition-colors shadow-2xs"
        >
          <ClipboardPaste size={16} aria-hidden="true" />
          Paste from clipboard
        </button>
      </div>

      <InputField
        label="Website address (URL)"
        type="url"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/..."
        hint="Only http and https links are accepted."
        error={url.length > 0 && invalid ? "Enter a complete http:// or https:// link." : undefined}
      />
    </AnalysisInputPage>
  );
}
