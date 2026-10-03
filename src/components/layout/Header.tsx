import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <NavLink to="/" aria-label="ScamLens home" className="tap-target flex items-center">
          <Logo />
        </NavLink>
        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          <NavLink to="/analyze" className={({ isActive }) => cn("tap-target flex items-center rounded-full px-4 text-sm font-medium", isActive ? "bg-pine-soft text-pine-dark" : "text-ink-soft hover:bg-ink/5")}>Check something</NavLink>
          <NavLink to="/history" className={({ isActive }) => cn("tap-target flex items-center rounded-full px-4 text-sm font-medium", isActive ? "bg-pine-soft text-pine-dark" : "text-ink-soft hover:bg-ink/5")}>History</NavLink>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="tap-target flex items-center justify-center text-ink sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-ink/10 bg-paper px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/analyze"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => cn("tap-target flex items-center rounded-lg px-4 py-3 text-base font-medium", isActive ? "bg-pine-soft text-pine-dark" : "text-ink-soft hover:bg-ink/5")}
            >
              Check something
            </NavLink>
            <NavLink
              to="/history"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => cn("tap-target flex items-center rounded-lg px-4 py-3 text-base font-medium", isActive ? "bg-pine-soft text-pine-dark" : "text-ink-soft hover:bg-ink/5")}
            >
              History
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
