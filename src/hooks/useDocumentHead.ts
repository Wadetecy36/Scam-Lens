import { useEffect } from "react";
import { env } from "@/config/env";

interface DocumentHeadOptions {
  title: string;
  description: string;
  path: string;
  /** Set false for pages that shouldn't be indexed (e.g. a specific result page with an id). */
  index?: boolean;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets per-route SEO tags. Deliberately dependency-free (no react-helmet) to
 * keep the bundle small — this is the entirety of what ScamLens needs for
 * static, client-rendered SEO metadata in Phase 1.
 */
export function useDocumentHead({ title, description, path, index = true }: DocumentHeadOptions): void {
  useEffect(() => {
    const fullTitle = `${title} · ScamLens`;
    document.title = fullTitle;
    setMeta("description", description);
    setMeta("robots", index ? "index, follow" : "noindex, nofollow");

    const canonicalUrl = `${env.appUrl.replace(/\/$/, "")}${path}`;
    setLink("canonical", canonicalUrl);

    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:image", `${env.appUrl.replace(/\/$/, "")}/images/social-share.svg`, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
  }, [title, description, path, index]);
}
