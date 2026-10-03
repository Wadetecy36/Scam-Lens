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
    title: "Information",
    links: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/learn", label: "Common scams" },
      { to: "/about", label: "About ScamLens" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="hairline mt-16 bg-background-dim">
      <div className="container-page py-10">
        <Logo />
        <p className="mt-2 max-w-sm text-sm text-foreground-soft">
          An AI safety check for suspicious messages, links, and online offers. Not a substitute for your own
          judgment, or for reporting a scam to your bank or the police.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-medium text-foreground">{group.title}</p>
              <ul className="mt-2.5 space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="tap-target inline-flex items-center text-sm text-foreground-soft hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-foreground-soft/80">© {new Date().getFullYear()} ScamLens. Before you click, check.</p>
      </div>
    </footer>
  );
}
