import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BRAND,
  CONCLUSION_METRICS,
  FAILURE_MODES,
  HERO_STATS,
  SUPPLIER_PROFILES,
} from "../data/project";
import { Badge, Button, Card, Section, SectionTitle } from "../components/ui";
import { AXIS_PROPS, ChartTooltip, CURSOR_FILL, PALETTE } from "../components/charts";
import { cn } from "../utils/cn";

const ICONS: Record<string, ReactNode> = {
  chart: (
    <path d="M4 19V6m5 13V10m5 9v-6m5 6V4" strokeLinecap="round" />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" strokeLinecap="round" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19a5.6 5.6 0 0 0-2.2-4.4" strokeLinecap="round" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 21 19H3L12 4.5Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 16.6v.2" strokeLinecap="round" />
    </>
  ),
};

function HeroPreview() {
  const data = [...SUPPLIER_PROFILES]
    .sort((a, b) => b.vpi - a.vpi)
    .map((s) => ({ name: s.name.split("_")[0], vpi: +(s.vpi * 100).toFixed(1), raw: s.vpi }));

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Live vendor board
          </span>
        </div>
        <span className="num text-[11px] text-slate-400">777 POs · 5 suppliers</span>
      </div>

      <div className="px-2 pt-4">
        <div className="h-[196px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 16, left: -14, bottom: 0 }} barSize={26}>
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis domain={[0, 100]} {...AXIS_PROPS} />
              <Tooltip
                cursor={CURSOR_FILL}
                content={
                  <ChartTooltip formatter={(v) => `VPI ${(Number(v) / 100).toFixed(3)}`} />
                }
              />
              <Bar dataKey="vpi" name="VPI" radius={[4, 4, 0, 0]}>
                {data.map((d, i) => (
                  <Cell key={d.name} fill={i === 0 ? PALETTE.accent : PALETTE.accentPale} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
        {[
          { k: "Top vendor", v: "Epsilon" },
          { k: "Model accuracy", v: "90.03%" },
          { k: "AUC-ROC", v: "0.935" },
        ].map((m) => (
          <div key={m.k} className="px-3 py-3 text-center">
            <div className="num text-[15px] font-semibold text-navy-900">{m.v}</div>
            <div className="mt-0.5 text-[10.5px] uppercase tracking-wider text-slate-400">{m.k}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Home() {
  const [openMode, setOpenMode] = useState<string | null>(FAILURE_MODES[0].id);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(#dcefe7 1px, transparent 1px), linear-gradient(90deg, #dcefe7 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 30% 0%, #000 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 30% 0%, #000 40%, transparent 100%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">B.Tech Major Project 2025–26</Badge>
              <Badge tone="neutral">Zero ERP Dependency</Badge>
            </div>
            <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-navy-900 sm:text-5xl">
              VendorIQ —{" "}
              <span className="text-accent-600">Autonomous AI-Powered Procurement Intelligence</span>{" "}
              for Indian MSMEs
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
              A zero-ERP, <span className="font-semibold text-navy-900">CSV-native</span> platform
              for Indian MSMEs. Upload the purchase-order files you already keep and get ranked
              suppliers, demand forecasts and automated reorder signals — no enterprise software
              prerequisite.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/vpi">
                Try VPI Calculator
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h11M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button to="/impact" variant="secondary">
                View Results
              </Button>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              {BRAND.tagline}
            </p>
          </div>

          <div className="lg:pl-4">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* Headline stat strip */}
      <section className="border-b border-slate-200 bg-navy-900">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-5 lg:divide-y-0">
            {HERO_STATS.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "px-2 py-6 sm:px-5",
                  i === 0 && "sm:border-l-0",
                )}
              >
                <div className="num text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">
                  {s.value}
                </div>
                <div className="mt-1.5 text-[13px] font-medium text-accent-200">{s.label}</div>
                <div className="mt-0.5 text-[11.5px] text-slate-400">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Failure modes */}
      <Section>
        <SectionTitle
          title="Three Interlocking Failure Modes"
          subtitle="Indian MSME procurement fails in three places at once — and each failure feeds the next. Select a card to expand."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {FAILURE_MODES.map((m, idx) => {
            const open = openMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setOpenMode(open ? null : m.id)}
                className={cn(
                  "card card-pad group text-left transition-all duration-200",
                  open
                    ? "border-accent-300 shadow-[0_2px_6px_rgba(4,26,21,0.08),0_20px_44px_-20px_rgba(11,128,89,0.55)]"
                    : "hover:border-slate-300 hover:shadow-[0_2px_4px_rgba(4,26,21,0.06),0_16px_36px_-18px_rgba(4,26,21,0.4)]",
                )}
                aria-expanded={open}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      open ? "bg-accent-600 text-white" : "bg-accent-50 text-accent-600",
                    )}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {ICONS[m.icon]}
                    </svg>
                  </span>
                  <span className="num text-xs font-semibold text-slate-300">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-navy-900">
                  {m.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{m.summary}</p>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-100 pt-3 text-[13px] leading-relaxed text-slate-500">
                      {m.detail}
                    </p>
                  </div>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-accent-600">
                  {open ? "Show less" : "Read more"}
                  <svg
                    viewBox="0 0 20 20"
                    className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Results teaser */}
      <Section className="pt-0">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.25fr]">
            <div className="border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="eyebrow">Validated outcome</p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-navy-900 sm:text-2xl">
                A classifier that beats the Oracle AI baseline — on data an MSME already has.
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
                Nine classifiers were benchmarked on identical stratified folds. The selected
                XGBoost model reaches 90.03% test accuracy against the 89% Oracle AI reference,
                without requiring any ERP integration.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/models" variant="secondary">
                  See the benchmark
                </Button>
                <Button to="/dataset" variant="ghost">
                  Explore the dataset →
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
              {CONCLUSION_METRICS.map((m) => (
                <div key={m.label} className="p-6 text-center">
                  <div className="num text-2xl font-semibold tracking-tight text-accent-700">
                    {m.value}
                  </div>
                  <div className="mt-1.5 text-[12px] font-medium text-slate-500">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
