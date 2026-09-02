import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ROUTES, TEAM, BRAND } from "../data/project";
import { navigate } from "../router";
import { cn } from "../utils/cn";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#/"
      onClick={(e) => {
        e.preventDefault();
        navigate("/");
      }}
      className="group flex items-center gap-2.5"
      aria-label="VendorIQ home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
          <path d="M4 17.5 9 11l4 4 6.5-8.5" stroke="#4fb591" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19.5" cy="6.5" r="2" fill="#fff" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-navy-900">
            Vendor<span className="text-accent-600">IQ</span>
          </span>
          <span className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-slate-400">
            Procurement Intelligence
          </span>
        </span>
      )}
    </a>
  );
}

export function TopNav({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-200",
        scrolled ? "border-slate-200 shadow-[0_4px_20px_-14px_rgba(10,22,40,0.6)]" : "border-slate-200/70",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 sm:px-8">
        <Logo />

        <nav className="ml-auto hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {ROUTES.map((r) => {
            const active = path === r.path;
            return (
              <a
                key={r.path}
                href={`#${r.path}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(r.path);
                }}
                className={cn(
                  "relative rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors duration-150",
                  active
                    ? "text-accent-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-navy-900",
                )}
              >
                {r.short}
                {active && (
                  <span className="absolute inset-x-2.5 -bottom-[13px] h-0.5 rounded-full bg-accent-600" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-3">
          <a
            href="#/vpi"
            onClick={(e) => {
              e.preventDefault();
              navigate("/vpi");
            }}
            className="hidden rounded-lg bg-navy-900 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-800 sm:inline-flex"
          >
            Open VPI Calculator
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-slate-300 text-navy-900 xl:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-0.5 px-4 py-3 sm:grid-cols-2 sm:px-8" aria-label="Mobile">
            {ROUTES.map((r) => {
              const active = path === r.path;
              return (
                <a
                  key={r.path}
                  href={`#${r.path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(r.path);
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-accent-50 text-accent-700" : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {r.label}
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-accent-600" />}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-8 border-t border-navy-800 bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
                  <path d="M4 17.5 9 11l4 4 6.5-8.5" stroke="#82d0b3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="19.5" cy="6.5" r="2" fill="#fff" />
                </svg>
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Vendor<span className="text-accent-300">IQ</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-slate-400">{BRAND.sub}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-200 ring-1 ring-inset ring-white/10">
              Zero ERP Dependency
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Explore
            </h4>
            <ul className="mt-4 grid gap-2">
              {ROUTES.slice(0, 5).map((r) => (
                <li key={r.path}>
                  <a
                    href={`#${r.path}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(r.path);
                    }}
                    className="text-[13px] text-slate-400 transition-colors hover:text-white"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Project
            </h4>
            <ul className="mt-4 grid gap-2">
              {ROUTES.slice(5).map((r) => (
                <li key={r.path}>
                  <a
                    href={`#${r.path}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(r.path);
                    }}
                    className="text-[13px] text-slate-400 transition-colors hover:text-white"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12.5px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-medium text-slate-200">{TEAM.members.join(" · ")}</span> —{" "}
            {TEAM.institution}, {TEAM.department}
          </p>
          <p>
            Supervisor: <span className="text-slate-200">{TEAM.supervisor}</span> ·{" "}
            {TEAM.project}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children, path }: { children: ReactNode; path: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav path={path} />
      <main key={path} className="flex-1 animate-fade-up">
        {children}
      </main>
      <Footer />
    </div>
  );
}
