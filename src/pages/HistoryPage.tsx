import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowLeft, Clock } from "lucide-react";
import { RiskPill } from "@/components/risk/RiskPill";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/button-classes";
import { Alert } from "@/components/ui/Alert";
import { listHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from "@/services/history-service";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const TYPE_LABELS = { message: "Message", image: "Screenshot", url: "Link", call: "Phone Call" } as const;

export function HistoryPage() {
  useDocumentHead({
    title: "Saved History",
    description: "Review the scam checks you've chosen to save on this device.",
    path: "/history",
  });
  const [entries, setEntries] = useState<HistoryEntry[]>(() =>
    typeof window !== "undefined" ? listHistory() : [],
  );

  function remove(id: string) {
    deleteHistoryEntry(id);
    setEntries(listHistory());
  }

  function clear() {
    clearHistory();
    setEntries([]);
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <Link
        to="/"
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back home
      </Link>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">Saved History</h1>
          <p className="mt-2 text-sm sm:text-base text-foreground-soft">
            Only lightweight result details are saved here on your device. Your original messages or screenshots are never stored.
          </p>
        </div>
        {entries.length > 0 && (
          <Button variant="secondary" onClick={clear}>
            Clear all
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="mt-8 max-w-xl">
          <Alert title="No saved checks yet.">
            When you check a message and click "Save result", its verdict and security tips will be safely preserved here on your phone or browser.
          </Alert>
          <Link
            to="/analyze"
            className={buttonClasses({ className: "mt-6 inline-flex" })}
          >
            Check something now
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3 max-w-3xl">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-2xs transition-all hover:border-blue hover:shadow-sm"
            >
              <Link to={`/result/${entry.id}`} className="min-w-0 flex-1 focus:outline-none">
                <div className="flex items-center gap-3">
                  <RiskPill level={entry.riskLevel} score={entry.riskScore} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {TYPE_LABELS[entry.inputType]}
                  </span>
                </div>
                <p className="mt-2 text-base font-bold text-navy capitalize group-hover:text-blue transition-colors">
                  {entry.category.replaceAll("_", " ")}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-secondary">
                  <Clock size={12} aria-hidden="true" />
                  <span>{new Date(entry.createdAt).toLocaleString()}</span>
                </div>
              </Link>
              <button
                type="button"
                className="tap-target rounded-xl p-2.5 text-secondary hover:bg-red-soft hover:text-red transition-colors"
                onClick={() => remove(entry.id)}
                aria-label="Delete saved check"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
