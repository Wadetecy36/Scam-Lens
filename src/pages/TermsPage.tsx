import { useDocumentHead } from "@/hooks/useDocumentHead";

export function TermsPage() {
  useDocumentHead({
    title: "Terms of service",
    description: "The rules for using ScamLens.",
    path: "/terms",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <h1 className="font-heading text-4xl text-foreground">Terms of service</h1>
      
      <div className="mt-8 space-y-8 text-foreground-soft text-lg">
        <p>
          By using ScamLens, you agree to these basic rules. Please read them carefully.
        </p>

        <section>
          <h2 className="font-heading text-2xl text-foreground">Use ScamLens as a guide only</h2>
          <p className="mt-2">
            ScamLens offers advice based on common fraud patterns. It is a guide, not a guarantee. We cannot promise that every safe result is truly safe, or that every dangerous result is truly a scam. You must still use your own judgment.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-foreground">Your responsibility</h2>
          <p className="mt-2">
            You are responsible for the choices you make. If you are unsure about a message or an offer, you should verify it yourself. Contact the bank, business, or government office directly using a phone number you know is correct.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-foreground">No secret information</h2>
          <p className="mt-2">
            You agree never to submit sensitive credentials. This includes passwords, mobile money PINs, bank card numbers, or temporary login codes.
          </p>
        </section>
      </div>
    </main>
  );
}
