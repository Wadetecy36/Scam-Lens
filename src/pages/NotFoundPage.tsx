import { Link } from "react-router-dom";
import { ArrowLeft, ShieldQuestion } from "lucide-react";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { buttonClasses } from "@/components/ui/button-classes";

export function NotFoundPage() {
  useDocumentHead({
    title: "Page not found",
    description: "That ScamLens page doesn't exist.",
    path: "/404",
    index: false,
  });

  return (
    <main className="container-page py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-icon-bg text-blue">
        <ShieldQuestion size={36} aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-wider text-blue">404 Error</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-navy">
        That page isn't here.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base text-foreground-soft leading-relaxed">
        The link you followed may be broken, or the page may have been moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/analyze" className={buttonClasses({ size: "lg" })}>
          Check something
        </Link>
        <Link to="/" className={buttonClasses({ variant: "secondary", size: "lg" })}>
          <ArrowLeft size={16} /> Home
        </Link>
      </div>
    </main>
  );
}
