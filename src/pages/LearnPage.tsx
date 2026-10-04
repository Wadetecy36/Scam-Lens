import { Link } from "react-router-dom";
import { ArrowLeft, Smartphone, ShoppingBag, Users } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { buttonClasses } from "@/components/ui/button-classes";

export function LearnPage() {
  useDocumentHead({
    title: "Common scams",
    description: "Learn about the most common scams targeting mobile money and bank accounts in Ghana.",
    path: "/learn",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <Link
        to="/"
        className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <div className="mt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange-soft px-3.5 py-1 text-xs font-semibold text-orange mb-3">
          Awareness Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy">Common Scams in Ghana</h1>
        <p className="mt-3 text-base sm:text-lg text-foreground-soft leading-relaxed">
          Fraudsters use emotional pressure, urgency, and impersonation. Recognizing these patterns keeps you and your family safe.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
              <Smartphone size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">Fake Mobile Money Reversals</h2>
              <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
                A scammer sends an SMS made to look like an official MTN MoMo or Telecel Cash transfer alert from a personal phone number. Seconds later, they call begging you to refund the money "sent by mistake."
              </p>
              <div className="mt-4 rounded-xl border border-border bg-surface-secondary p-3.5 text-xs sm:text-sm font-semibold text-navy">
                <span className="text-blue">What to do:</span> Never send money back based on an SMS. Dial *170# or *110# directly to check your real balance. If someone made a mistake, tell them to contact the telecom provider to request an official reversal.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-soft text-purple">
              <ShoppingBag size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">Fake Online Shops & Delivery Fees</h2>
              <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
                You see discounted electronics, phones, or clothing on Instagram, TikTok, or WhatsApp. The seller demands payment or a "customs clearance fee" upfront via MoMo. Once you pay, they block you immediately.
              </p>
              <div className="mt-4 rounded-xl border border-border bg-surface-secondary p-3.5 text-xs sm:text-sm font-semibold text-navy">
                <span className="text-blue">What to do:</span> Pay cash or MoMo only upon delivery and inspection of the goods, or buy from verified sellers you already know and trust.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-soft text-red">
              <Users size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">The Fake Family Emergency</h2>
              <p className="mt-2 text-sm sm:text-base text-foreground-soft leading-relaxed">
                You get an urgent message or call claiming to be your child, grandchild, or nephew. They claim they were arrested, had an accident, or lost their wallet, and need funds sent immediately to a strange MoMo number.
              </p>
              <div className="mt-4 rounded-xl border border-border bg-surface-secondary p-3.5 text-xs sm:text-sm font-semibold text-navy">
                <span className="text-blue">What to do:</span> Pause and hang up. Call that relative on their known phone number, or call another family member to confirm their location before sending any money.
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 flex">
        <Link to="/analyze" className={buttonClasses({ size: "lg" })}>
          Check a suspicious message
        </Link>
      </div>
    </main>
  );
}
