import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const LINK_GROUPS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { to: "/analyze", label: "Check something" },
      { to: "/history", label: "History" },
      { to: "/family", label: "Family" },
      { to: "/settings", label: "Settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About ScamLens" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="hairline mt-16 bg-paper-dim">
      <div className="container-page py-10">
        <Logo />
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          An AI safety check for suspicious messages, links, and online offers. Not a substitute for your own
          judgment, or for reporting a scam to your bank or the police.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-medium text-ink">{group.title}</p>
              <ul className="mt-2.5 space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="tap-target inline-flex items-center text-sm text-ink-soft hover:text-pine">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-ink-soft/80">© {new Date().getFullYear()} ScamLens. Before you click, check.</p>
      </div>
    </footer>
  );
}
