import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

export function Header() {
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
        <NavLink to="/analyze" className="tap-target flex items-center rounded-full bg-pine px-4 text-sm font-medium text-paper sm:hidden">Check</NavLink>
      </div>
    </header>
  );
}
