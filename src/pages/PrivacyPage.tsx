import { useDocumentHead } from "@/hooks/useDocumentHead";

export function PrivacyPage() {
  useDocumentHead({
    title: "Privacy policy",
    description: "How ScamLens handles your information and keeps you safe.",
    path: "/privacy",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <h1 className="font-display text-4xl text-ink">Privacy policy</h1>
      
      <div className="mt-8 space-y-8 text-ink-soft text-lg">
        <p>
          This page explains how we handle your information when you use ScamLens. We believe in collecting as little personal data as possible.
        </p>

        <section>
          <h2 className="font-display text-2xl text-ink">What happens to the items you check</h2>
          <p className="mt-2">
            When you check a message, link, or picture, we process it to give you safety advice. Once the analysis is complete and you leave the page or close your browser, the actual content of your message or picture is cleared from our active system.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">Your history</h2>
          <p className="mt-2">
            If you check your past results in the "History" section, you will see a summary. We only save the risk level, the type of scam, and the date. We do not save the private text or pictures you uploaded in this history list.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">Keeping yourself safe</h2>
          <p className="mt-2">
            Please help us protect your privacy. You should never type or upload your passwords, PIN codes, or bank card details into ScamLens. We will never ask you for them.
          </p>
        </section>
      </div>
    </main>
  );
}
