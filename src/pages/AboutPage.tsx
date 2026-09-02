import { ShieldCheck } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { useStructuredData } from "@/hooks/useStructuredData";

export function AboutPage() {
  useDocumentHead({ title: "About ScamLens", description: "Learn what ScamLens does, who it is for, and what its AI analysis can and cannot tell you.", path: "/about" });
  useStructuredData({ "@context": "https://schema.org", "@type": "Organization", name: "ScamLens", url: "https://scamlens.example.com", description: "An AI safety check for suspicious messages, links, screenshots, and online offers." }, "organization");
  return <main className="container-page py-10 sm:py-14"><ShieldCheck aria-hidden="true" className="text-pine" size={28} /><h1 className="mt-3 font-display text-4xl">About ScamLens</h1><div className="mt-6 space-y-6 text-ink-soft"><p>ScamLens is a parent-focused digital safety tool designed to give people a clear second opinion before they click, pay, reply, or share information.</p><p>It looks for patterns commonly associated with scams, explains the warning signs, and recommends safer next steps without requiring cybersecurity knowledge.</p><p>ScamLens is not a guarantee. AI can miss scams and can flag legitimate messages. When money, accounts, or personal safety are involved, verify through an official channel you already trust.</p></div></main>;
}
