import { ShieldCheck } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { useStructuredData } from "@/hooks/useStructuredData";

export function AboutPage() {
  useDocumentHead({
    title: "About ScamLens",
    description: "Learn what ScamLens does, who it is for, and what its AI analysis can and cannot tell you.",
    path: "/about",
  });
  
  useStructuredData(
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ScamLens",
      url: "https://scamlens.example.com",
      description: "An AI safety check for suspicious messages, links, screenshots, and online offers.",
    },
    "organization"
  );

  return (
    <main className="container-reading py-10 sm:py-14">
      <ShieldCheck aria-hidden="true" className="text-pine" size={32} />
      <h1 className="mt-4 font-display text-4xl text-ink">About ScamLens</h1>
      
      <div className="mt-8 space-y-6 text-ink-soft text-lg">
        <p>
          ScamLens is a digital safety service. We help you check if a message, link, or picture might be a scam before you reply, click, or pay.
        </p>
        
        <p>
          It is built to be simple and clear. You do not need to be an expert with computers or mobile phones to use it. When you share something suspicious with us, we look for common tricks that fraudsters use to try and take your money or personal details.
        </p>
        
        <h2 className="mt-8 font-display text-2xl text-ink">What we can do</h2>
        <p>
          We can give you a second opinion. If someone sends you an urgent message asking for money, we can tell you if it looks like a known scam. We explain the warning signs in plain English and suggest safe steps you can take.
        </p>
        
        <h2 className="mt-8 font-display text-2xl text-ink">What we cannot do</h2>
        <p>
          ScamLens is not perfect. Our system might miss a new type of scam, or it might flag a message that is actually safe. 
        </p>
        <p>
          We cannot recover stolen money or investigate crimes. If you have lost money, you must contact your bank or mobile money provider immediately. 
        </p>
      </div>
    </main>
  );
}
