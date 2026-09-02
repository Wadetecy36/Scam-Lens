import { useEffect } from "react";

/**
 * Injects a JSON-LD <script> tag for the current page and removes it on
 * unmount. Call once per page with a schema.org object appropriate to that
 * page's actual content — never add structured data just because a
 * checklist asks for it (see build spec #34).
 */
export function useStructuredData(schema: Record<string, unknown>, key: string): void {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `structured-data-${key}`;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
