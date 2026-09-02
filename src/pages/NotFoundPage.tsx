import { Link } from "react-router-dom";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { buttonClasses } from "@/components/ui/Button";
export function NotFoundPage() { useDocumentHead({ title: "Page not found", description: "That ScamLens page doesn't exist.", path: "/404", index: false }); return <main className="container-page py-16 text-center"><p className="text-sm font-medium text-pine">404</p><h1 className="mt-2 font-display text-4xl">That page isn't here.</h1><p className="mx-auto mt-3 max-w-md text-ink-soft">The safest next step is simple: go back and check something.</p><Link to="/analyze" className={buttonClasses({ size: "lg", className: "mt-6" })}>Check something</Link></main>; }
