import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { to: "/analyze", label: "Check something" },
  { to: "/history", label: "History" },
  { to: "/family", label: "Family" },
  { to: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <NavLink to="/" aria-label="ScamLens home" className="tap-target flex items-center">
          <Logo />
        </NavLink>
        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "tap-target flex items-center rounded-full px-3.5 text-sm font-medium transition-colors",
                  isActive ? "bg-pine-soft text-pine-dark" : "text-ink-soft hover:bg-ink/5",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/analyze"
          className="tap-target flex items-center rounded-full bg-pine px-4 text-sm font-medium text-paper sm:hidden"
        >
          Check
        </NavLink>
      </div>
    </header>
  );
}
