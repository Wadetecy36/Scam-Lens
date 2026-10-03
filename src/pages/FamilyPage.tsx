import { Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/button-classes";

export function FamilyPage() {
  useDocumentHead({ title: "Family safety", description: "Learn how trusted family members can optionally help review ScamLens results.", path: "/family" });
  return <main className="container-page py-10 sm:py-14"><Users aria-hidden="true" className="text-primary" size={28} /><h1 className="mt-3 font-heading text-4xl">A second pair of eyes</h1><p className="mt-4 text-lg text-foreground-soft">Sometimes the easiest way to feel confident is to ask someone you trust. ScamLens can be designed to let a parent share a result with a family member for a second opinion.</p><Card className="mt-8"><ShieldCheck aria-hidden="true" className="text-primary" size={24} /><h2 className="mt-3 font-heading text-xl">Optional by design</h2><p className="mt-2 text-sm text-foreground-soft">You can use ScamLens completely on your own. A trusted contact is a future safety layer, not a requirement.</p></Card><p className="mt-8 text-sm text-foreground-soft">The invite and notification workflow is intentionally not active in Phase 1. The product boundary is ready for it later without pretending the feature already works.</p><Link to="/analyze" className={buttonClasses({ className: "mt-5 inline-flex" })}>Check something</Link></main>;
}
