import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { navigate } from "../router";

/* ------------------------------ Page shell ------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  meta?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-navy-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 130% at 12% 0%, rgba(27,138,107,0.55), transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="eyebrow-light">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.1]">
          {title}
        </h1>
        {lead && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-elf-100/85">{lead}</p>}
        {meta && <div className="mt-6">{meta}</div>}
      </div>
    </header>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12", className)}>
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-white/85">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/* --------------------------------- Cards --------------------------------- */

export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return <As className={cn("card", className)}>{children}</As>;
}

export function StatCard({
  value,
  label,
  note,
  accent,
  className,
}: {
  value: string;
  label: string;
  note?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card card-pad transition-shadow duration-200 hover:shadow-[0_2px_4px_rgba(10,22,40,0.05),0_16px_36px_-16px_rgba(10,22,40,0.22)]",
        accent && "border-accent-200 bg-accent-50/60",
        className,
      )}
    >
      <div
        className={cn(
          "num text-2xl font-semibold tracking-tight sm:text-[1.75rem]",
          accent ? "text-accent-700" : "text-navy-900",
        )}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[13px] font-medium text-navy-900">{label}</div>
      {note && <div className="mt-0.5 text-xs text-slate-500">{note}</div>}
    </div>
  );
}

/* -------------------------------- Badges --------------------------------- */

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "good" | "warn" | "bad" | "dark";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
    accent: "bg-accent-50 text-accent-700 ring-accent-200",
    good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-amber-50 text-amber-700 ring-amber-200",
    bad: "bg-rose-50 text-rose-700 ring-rose-200",
    dark: "bg-navy-900 text-white ring-navy-900",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------- Buttons -------------------------------- */

export function Button({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-navy-900 text-white hover:bg-navy-800 shadow-[0_8px_22px_-10px_rgba(4,26,21,0.9)]",
    secondary:
      "bg-white text-navy-900 ring-1 ring-inset ring-white/60 hover:bg-elf-50 shadow-[0_6px_18px_-10px_rgba(4,26,21,0.6)]",
    ghost: "text-accent-700 hover:bg-accent-50",
  };
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
    variants[variant],
    className,
  );

  if (to) {
    return (
      <a
        href={`#${to}`}
        className={base}
        onClick={(e) => {
          e.preventDefault();
          navigate(to);
        }}
      >
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <a href={href} className={base} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={base} onClick={onClick}>
      {children}
    </button>
  );
}

/* ------------------------------- Data bits ------------------------------- */

export function KeyValue({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
      <dt className="text-[13px] text-slate-500">{k}</dt>
      <dd className="num text-[13px] font-semibold text-navy-900">{v}</dd>
    </div>
  );
}

export function Formula({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-navy-950 px-4 py-3">
      {label && (
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-300">
          {label}
        </div>
      )}
      <code className="block font-mono text-[13px] leading-relaxed text-slate-100 sm:text-sm">
        {children}
      </code>
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  tone = "accent",
}: {
  value: number;
  max?: number;
  tone?: "accent" | "good" | "warn" | "bad" | "dark";
}) {
  const tones: Record<string, string> = {
    accent: "bg-accent-600",
    good: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-rose-500",
    dark: "bg-navy-800",
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn("h-full rounded-full transition-[width] duration-500 ease-out", tones[tone])}
        style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
      />
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-slate-200", className)} />;
}
