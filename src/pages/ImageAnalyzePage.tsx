import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { AnalysisInputPage } from "@/pages/AnalysisInputPage";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import type { ScamAnalysisInput } from "@/ai/scam-analysis/schema";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export function ImageAnalyzePage() {
  useDocumentHead({ title: "Check a screenshot", description: "Upload a screenshot of a suspicious message or online offer to ScamLens.", path: "/analyze/image" });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const getInput = (): ScamAnalysisInput => ({ type: "image", text: file ? `Screenshot uploaded: ${file.name}` : undefined });

  function choose(next: File | undefined) {
    if (!next) return;
    if (!TYPES.has(next.type)) { setError("Use a PNG, JPG, or WEBP image."); setFile(null); return; }
    if (next.size > MAX_BYTES) { setError("That image is larger than 8 MB. Choose a smaller screenshot."); setFile(null); return; }
    setError(null); setFile(next);
  }

  return (
    <AnalysisInputPage type="image" title="Upload a screenshot" description="Choose a screenshot of the suspicious message, offer, or conversation. The live image-reading analysis will be added in Phase 2." getInput={getInput} disabled={!file}>
      <div className="rounded-[var(--radius-card)] border-2 border-dashed border-ink/20 bg-white/50 p-6 text-center">
        <Upload aria-hidden="true" className="mx-auto text-pine" size={30} />
        <p className="mt-3 font-display text-xl">Choose an image</p>
        <p className="mt-1 text-sm text-ink-soft">PNG, JPG, or WEBP · up to 8 MB</p>
        <label className="mt-5 inline-flex">
          <span className={buttonClasses({ size: "md" })}>Choose screenshot</span>
          <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => choose(e.target.files?.[0])} />
        </label>
        {file && <div className="mx-auto mt-5 flex max-w-sm items-center gap-3 rounded-xl bg-pine-soft p-3 text-left"><span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span><button type="button" className="tap-target rounded-full p-2 text-ink-soft hover:bg-white" onClick={() => setFile(null)} aria-label="Remove selected screenshot"><X size={18} /></button></div>}
      </div>
      {error && <div className="mt-4"><Alert tone="warning" title="We couldn't use that image.">{error}</Alert></div>}
    </AnalysisInputPage>
  );
}
