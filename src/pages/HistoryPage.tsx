import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { RiskPill } from "@/components/risk/RiskPill";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { listHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from "@/services/history-service";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const TYPE_LABELS = { message: "Message", image: "Screenshot", url: "Link", call: "Call" } as const;

export function HistoryPage() {
  useDocumentHead({ title: "History", description: "Review the scam checks you've chosen to save on this device.", path: "/history" });
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  useEffect(() => setEntries(listHistory()), []);
  function remove(id: string) { deleteHistoryEntry(id); setEntries(listHistory()); }
  function clear() { clearHistory(); setEntries([]); }
  return <main className="container-page py-10 sm:py-14"><div className="flex items-end justify-between gap-4"><div><h1 className="mt-1 font-display text-4xl">History</h1></div>{entries.length > 0 && <Button variant="quiet" onClick={clear}>Clear all</Button>}</div><p className="mt-4 text-ink-soft">Only lightweight result details are saved here. Your original message or screenshot isn't stored in history.</p>{entries.length === 0 ? <div className="mt-8"><Alert title="No saved checks yet.">When you save a result, you'll find its risk level and basic details here.</Alert><Link to="/analyze" className="mt-5 inline-flex"><Button>Check something</Button></Link></div> : <div className="mt-8 space-y-3">{entries.map((entry) => <div key={entry.id} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-ink/10 bg-white/50 p-4"><Link to={`/result/${entry.id}`} className="min-w-0 flex-1"><RiskPill level={entry.riskLevel} score={entry.riskScore} /><p className="mt-2 text-sm font-medium">{TYPE_LABELS[entry.inputType]} · {entry.category.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-ink-soft">{new Date(entry.createdAt).toLocaleString()}</p></Link><button type="button" className="tap-target rounded-full p-2 text-ink-soft hover:bg-ink/5" onClick={() => remove(entry.id)} aria-label="Delete saved check"><Trash2 size={18} /></button></div>)}</div>}</main>;
}
