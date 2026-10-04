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
    <footer className="mt-20 border-t border-border bg-surface-secondary">
      <div className="container-page py-12">
        <Logo />
        <p className="mt-3 max-w-md text-sm text-text-body leading-relaxed">
          An advisory second-opinion tool for suspicious messages, links, and online offers in Ghana. Not a substitute for your own judgment, or for reporting a scam directly to your bank or the police.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-12">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-bold uppercase tracking-wider text-navy">{group.title}</p>
              <ul className="mt-3.5 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="tap-target inline-flex items-center text-sm text-text-body transition-colors hover:text-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-text-secondary">
          © {new Date().getFullYear()} ScamLens. Before you click, check.
        </p>
      </div>
    </footer>
  );
}
