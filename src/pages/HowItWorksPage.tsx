import { useDocumentHead } from "@/hooks/useDocumentHead";

export function HowItWorksPage() {
  useDocumentHead({
    title: "How it works",
    description: "Learn how ScamLens checks messages, links, and pictures for signs of fraud.",
    path: "/how-it-works",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <h1 className="font-heading text-4xl text-foreground">How it works</h1>
      <div className="mt-6 space-y-8 text-foreground-soft text-lg">
        <section>
          <h2 className="font-heading text-2xl text-foreground">1. You share the suspicious item</h2>
          <p className="mt-2">
            You can type in a message, paste a website link, or upload a screenshot of an email, SMS, or social media post. Do not include passwords or PIN codes.
          </p>
        </section>
        
        <section>
          <h2 className="font-heading text-2xl text-foreground">2. We check for common tricks</h2>
          <p className="mt-2">
            Our system looks at the words and patterns in what you shared. It checks for common signs of a scam, such as asking for money quickly, threatening you, or pretending to be a bank or mobile money service.
          </p>
        </section>
        
        <section>
          <h2 className="font-heading text-2xl text-foreground">3. We explain the risk</h2>
          <p className="mt-2">
            We will tell you if the item looks safe, suspicious, or very dangerous. We explain exactly why it was flagged, in plain language.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-foreground">4. You decide what to do</h2>
          <p className="mt-2">
            We give you clear advice on what to do next, like calling your bank directly using the number on your bank card. Remember, ScamLens is a tool to help you think. It is not perfect, and you should always trust your instincts.
          </p>
        </section>
      </div>
    </main>
  );
}
