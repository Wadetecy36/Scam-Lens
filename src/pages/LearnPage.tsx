import { useDocumentHead } from "@/hooks/useDocumentHead";

export function LearnPage() {
  useDocumentHead({
    title: "Common scams",
    description: "Learn about the most common scams targeting mobile money and bank accounts.",
    path: "/learn",
  });

  return (
    <main className="container-reading py-10 sm:py-14">
      <h1 className="font-heading text-4xl text-foreground">Common scams</h1>
      <div className="mt-6 space-y-8 text-foreground-soft text-lg">
        <p>
          Fraudsters are constantly inventing new ways to trick people, but many scams follow the same patterns. Here are some of the most common ones to look out for.
        </p>
        <section>
          <h2 className="font-heading text-2xl text-foreground">Mobile money fraud</h2>
          <p className="mt-2">
            Someone calls or sends a message pretending to be mobile money staff. They might say your account is blocked, or that you won a prize. They will then ask for your PIN to "help" you or to process your winnings.
          </p>
          <p className="mt-2 font-medium text-foreground">
            What to do: Hang up. Real mobile money staff will never ask for your PIN.
          </p>
        </section>
        
        <section>
          <h2 className="font-heading text-2xl text-foreground">Fake online shops</h2>
          <p className="mt-2">
            You see an advert for a very cheap item on social media. The seller asks you to send money first before they deliver the item. After you pay, they block you and you never receive the goods.
          </p>
          <p className="mt-2 font-medium text-foreground">
            What to do: Pay only on delivery, or buy from people and shops you know and trust.
          </p>
        </section>
        
        <section>
          <h2 className="font-heading text-2xl text-foreground">The fake emergency</h2>
          <p className="mt-2">
            You get a message from an unknown number claiming to be a family member or friend. They say they have lost their phone, are in trouble, and need you to send money immediately.
          </p>
          <p className="mt-2 font-medium text-foreground">
            What to do: Call the person on their normal number to check if it is really them before you send any money.
          </p>
        </section>
      </div>
    </main>
  );
}
