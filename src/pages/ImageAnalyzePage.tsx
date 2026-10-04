import { useState } from "react";
import { Upload, X } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";
import { Alert } from "@/components/ui/Alert";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export function ImageAnalyzePage() {
  useDocumentHead({
    title: "Check a screenshot",
    description: "Upload a screenshot of a suspicious message or online offer to ScamLens.",
    path: "/analyze/image",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const getInput = (): ScamAnalysisInput => ({
    type: "image",
    text: file ? `Screenshot uploaded: ${file.name}` : undefined,
  });

  function choose(next: File | undefined) {
    if (!next) return;
    if (!TYPES.has(next.type)) {
      setError("Please choose a PNG, JPG, or WEBP image.");
      setFile(null);
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("That image is larger than 8 MB. Please choose a smaller screenshot.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(next);
  }

  return (
    <AnalysisInputPage
      type="image"
      title="Upload a screenshot"
      description="Choose a screenshot of the suspicious message, receipt, payment prompt, or conversation."
      getInput={getInput}
      disabled={!file}
    >
      <div className="rounded-2xl border-2 border-dashed border-border bg-surface-secondary/60 p-8 text-center transition-colors hover:border-blue">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-soft text-purple">
          <Upload aria-hidden="true" size={28} />
        </div>
        <p className="mt-4 text-lg font-bold text-navy">Choose an image or screenshot</p>
        <p className="mt-1 text-sm text-foreground-soft">PNG, JPG, or WEBP · up to 8 MB</p>

        <label className="mt-5 inline-flex cursor-pointer">
          <span className={buttonClasses({ size: "md" })}>Browse photos</span>
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => choose(e.target.files?.[0])}
          />
        </label>

        {file && (
          <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-xl border border-border bg-white p-3 text-left shadow-2xs">
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-navy">{file.name}</span>
            <button
              type="button"
              className="tap-target rounded-full p-1.5 text-foreground-soft hover:bg-surface-secondary hover:text-red transition-colors"
              onClick={() => setFile(null)}
              aria-label="Remove selected screenshot"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4">
          <Alert tone="warning" title="We couldn't use that image.">
            {error}
          </Alert>
        </div>
      )}
    </AnalysisInputPage>
  );
}
