import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-nav bg-white">
      <div className="container-page flex h-20 items-center justify-between">
        <NavLink to="/" aria-label="ScamLens home" className="tap-target flex items-center">
          <Logo />
        </NavLink>
        <nav aria-label="Primary" className="hidden items-center gap-2 sm:flex">
          <NavLink
            to="/analyze"
            className={({ isActive }) =>
              cn(
                "tap-target inline-flex items-center rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors duration-150",
                isActive
                  ? "bg-blue-icon-bg text-blue"
                  : "text-navy/80 hover:bg-surface-secondary hover:text-navy",
              )
            }
          >
            Check something
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              cn(
                "tap-target inline-flex items-center rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors duration-150",
                isActive
                  ? "bg-blue-icon-bg text-blue"
                  : "text-navy/80 hover:bg-surface-secondary hover:text-navy",
              )
            }
          >
            History
          </NavLink>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="tap-target flex items-center justify-center rounded-lg text-navy hover:bg-surface-secondary sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-border-nav bg-white px-5 py-4 sm:hidden">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/analyze"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "tap-target flex items-center rounded-xl px-4 py-3 text-base font-semibold",
                  isActive
                    ? "bg-blue-icon-bg text-blue"
                    : "text-navy hover:bg-surface-secondary",
                )
              }
            >
              Check something
            </NavLink>
            <NavLink
              to="/history"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "tap-target flex items-center rounded-xl px-4 py-3 text-base font-semibold",
                  isActive
                    ? "bg-blue-icon-bg text-blue"
                    : "text-navy hover:bg-surface-secondary",
                )
              }
            >
              History
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
