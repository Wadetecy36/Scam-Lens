import { useDocumentHead } from "@/hooks/useDocumentHead";

export function ContactPage() {
  useDocumentHead({
    title: "Contact us",
    description: "How to get in touch with the ScamLens team.",
    path: "/contact",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <h1 className="font-display text-4xl text-ink">Contact us</h1>
      <div className="mt-8 space-y-8 text-ink-soft text-lg">
        <p>
          If you have questions about how ScamLens works, or if you want to report a problem with the service, you can reach out to us.
        </p>
        
        <section>
          <h2 className="font-display text-2xl text-ink">Email</h2>
          <p className="mt-2">
            You can email us at <strong className="font-medium text-ink">support@scamlens.org</strong>. We aim to reply within two working days.
          </p>
        </section>
        
        <section>
          <h2 className="font-display text-2xl text-ink">Important note</h2>
          <p className="mt-2">
            We cannot recover lost money or investigate crimes. If you have been a victim of fraud, please report it directly to your bank, mobile network operator, or the police immediately.
          </p>
        </section>
      </div>
    </main>
  );
}
