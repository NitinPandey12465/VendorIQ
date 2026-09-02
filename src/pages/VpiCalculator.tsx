import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  SUPPLIER_PROFILES,
  VPI_COMPONENTS,
  VPI_WEIGHTS,
  type SupplierProfile,
} from "../data/project";
import { Badge, Card, Formula, PageHeader, Section, SectionTitle } from "../components/ui";
import {
  AXIS_PROPS,
  ChartCard,
  ChartTooltip,
  CURSOR_FILL,
  Legend,
  PALETTE,
} from "../components/charts";
import { cn } from "../utils/cn";

type Scores = { pcs: number; qrs: number; ltas: number; crs: number };

const DEFAULT_SCORES: Scores = { pcs: 75, qrs: 88, ltas: 80, crs: 82 };

function computeVpi(s: Scores): number {
  return (
    (VPI_WEIGHTS.alpha * s.pcs +
      VPI_WEIGHTS.beta * s.qrs +
      VPI_WEIGHTS.gamma * s.ltas +
      VPI_WEIGHTS.delta * s.crs) /
    100
  );
}

function grade(vpi: number) {
  if (vpi >= 0.85) return { label: "Preferred", tone: "good" as const, note: "Auto-RFQ eligible — top tier" };
  if (vpi >= 0.78) return { label: "Approved", tone: "accent" as const, note: "Within the standard sourcing pool" };
  if (vpi >= 0.7) return { label: "Watchlist", tone: "warn" as const, note: "Quarterly review required" };
  return { label: "At risk", tone: "bad" as const, note: "Escalate — consider re-tendering" };
}

function Slider({
  label,
  code,
  symbol,
  weight,
  value,
  onChange,
  desc,
}: {
  label: string;
  code: string;
  symbol: string;
  weight: number;
  value: number;
  onChange: (v: number) => void;
  desc: string;
}) {
  const contribution = (weight * value) / 100;
  return (
    <div className="border-b border-slate-100 px-5 py-4 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-semibold text-accent-700">{code}</span>
          <span className="text-[13px] text-navy-900">{label}</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] text-slate-500">
            {symbol} = {weight.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) onChange(Math.max(0, Math.min(100, n)));
            }}
            className="num w-[74px] rounded-md border border-slate-300 px-2 py-1 text-right text-[13px] font-semibold text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            aria-label={`${code} value`}
          />
          <span className="text-[12px] text-slate-400">%</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${code} slider`}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-accent-600 outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-600 [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(11,128,89,0.22)]"
        style={{
          background: `linear-gradient(90deg, var(--color-accent-600) ${value}%, #e2e8f0 ${value}%)`,
        }}
      />

      <div className="mt-2 flex items-start justify-between gap-4">
        <p className="max-w-md text-[11.5px] leading-relaxed text-slate-500">{desc}</p>
        <span className="num shrink-0 whitespace-nowrap text-[11.5px] font-semibold text-slate-500">
          contributes {contribution.toFixed(3)}
        </span>
      </div>
    </div>
  );
}

export default function VpiCalculator() {
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [preset, setPreset] = useState<string>("custom");

  const vpi = useMemo(() => computeVpi(scores), [scores]);
  const g = grade(vpi);

  const setScore = (k: keyof Scores) => (v: number) => {
    setScores((s) => ({ ...s, [k]: v }));
    setPreset("custom");
  };

  const loadPreset = (p: SupplierProfile) => {
    setScores({ pcs: p.pcs, qrs: p.qrs, ltas: p.ltas, crs: p.crs });
    setPreset(p.id);
  };

  const reset = () => {
    setScores(DEFAULT_SCORES);
    setPreset("custom");
  };

  const yourLabel = preset === "custom" ? "Your Supplier" : "Your Supplier (edited)";

  /* Comparison data: five benchmarks + the live input */
  const comparison = useMemo(() => {
    const rows = SUPPLIER_PROFILES.map((s) => ({
      name: s.name.split("_")[0],
      fullName: s.name,
      vpi: +computeVpi(s).toFixed(3),
      you: false,
    }));
    rows.push({ name: "You", fullName: yourLabel, vpi: +vpi.toFixed(3), you: true });
    return rows.sort((a, b) => b.vpi - a.vpi);
  }, [vpi, yourLabel]);

  const rank = comparison.findIndex((r) => r.you) + 1;

  const radarData = useMemo(() => {
    const best = SUPPLIER_PROFILES[0]; // Epsilon — highest VPI
    return VPI_COMPONENTS.map((c) => ({
      axis: c.code,
      you: scores[c.key],
      best: best[c.key],
    }));
  }, [scores]);

  const contributions = useMemo(
    () =>
      VPI_COMPONENTS.map((c) => ({
        code: c.code,
        contribution: +((c.weight * scores[c.key]) / 100).toFixed(4),
        max: c.weight,
      })),
    [scores],
  );

  const top3 = comparison.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="VPI Calculator"
        title="Vendor Performance Index — score any supplier in four numbers"
        lead="A single weighted score that collapses price, quality, timing and compliance history into one comparable figure. Move the sliders and every chart on this page recomputes instantly."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Live calculation</Badge>
            <Badge tone="neutral">5 benchmark suppliers loaded</Badge>
            <Badge tone="dark">Auto-RFQ ready</Badge>
          </div>
        }
      />

      <Section>
        <Card className="card-pad">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">The formula</p>
              <div className="mt-3">
                <Formula>VPI = α·PCS + β·QRS + γ·LTAS + δ·CRS</Formula>
              </div>
              <div className="mt-3">
                <Formula label="Weights used throughout the platform">
                  α = 0.25 &nbsp; β = 0.35 &nbsp; γ = 0.25 &nbsp; δ = 0.15
                </Formula>
              </div>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {VPI_COMPONENTS.map((c) => (
                <div key={c.code} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12.5px] font-bold text-accent-700">
                      {c.code}
                    </span>
                    <span className="num rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                      {c.symbol} {c.weight.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[12.5px] font-semibold text-navy-900">{c.name}</div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          {/* ------------------------------ Inputs ----------------------------- */}
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-navy-900">
                  Score your supplier
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Enter component scores on a 0–100 scale, or load a benchmark supplier.
                </p>
              </div>
              <button
                onClick={reset}
                className="rounded-md px-2 py-1 text-[12px] font-semibold text-accent-600 hover:bg-accent-50"
              >
                Reset
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 px-5 py-3">
              {SUPPLIER_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadPreset(p)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                    preset === p.id
                      ? "bg-accent-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {p.name.split("_")[0]}
                </button>
              ))}
              <button
                onClick={reset}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                  preset === "custom"
                    ? "bg-navy-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                Custom
              </button>
              <p className="mt-1 w-full text-[11px] leading-relaxed text-slate-400">
                Loading a benchmark supplier fills the sliders with its component scores, which
                reproduce that supplier's published VPI exactly.
              </p>
            </div>

            {VPI_COMPONENTS.map((c) => (
              <Slider
                key={c.code}
                label={c.name}
                code={c.code}
                symbol={c.symbol}
                weight={c.weight}
                value={scores[c.key]}
                onChange={setScore(c.key)}
                desc={c.desc}
              />
            ))}
          </Card>

          {/* ------------------------------ Output ----------------------------- */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="bg-navy-900 px-5 py-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-300">
                      Computed VPI
                    </p>
                    <div className="mt-2 flex items-end gap-3">
                      <span className="num text-[3.2rem] font-semibold leading-none tracking-tight">
                        {vpi.toFixed(3)}
                      </span>
                      <span className="mb-1.5 text-[13px] text-slate-400">/ 1.000</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset",
                      g.tone === "good" && "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
                      g.tone === "accent" && "bg-accent-400/15 text-accent-200 ring-accent-400/30",
                      g.tone === "warn" && "bg-amber-400/15 text-amber-300 ring-amber-400/30",
                      g.tone === "bad" && "bg-rose-400/15 text-rose-300 ring-rose-400/30",
                    )}
                  >
                    {g.label}
                  </span>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-300 ease-out",
                      g.tone === "good" && "bg-emerald-400",
                      g.tone === "accent" && "bg-accent-400",
                      g.tone === "warn" && "bg-amber-400",
                      g.tone === "bad" && "bg-rose-400",
                    )}
                    style={{ width: `${vpi * 100}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-slate-400">
                  <span>{g.note}</span>
                  <span className="num">
                    Rank {rank} of {comparison.length}
                  </span>
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Weighted contribution breakdown
                </p>
                <div className="mt-3 space-y-2.5">
                  {contributions.map((c) => (
                    <div key={c.code} className="flex items-center gap-3">
                      <span className="w-12 shrink-0 font-mono text-[11.5px] font-semibold text-slate-500">
                        {c.code}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-accent-500 transition-[width] duration-300 ease-out"
                          style={{ width: `${(c.contribution / 0.35) * 100}%` }}
                        />
                      </div>
                      <span className="num w-20 shrink-0 text-right text-[11.5px] font-semibold text-navy-900">
                        {c.contribution.toFixed(3)}
                        <span className="ml-1 font-normal text-slate-400">/{c.max.toFixed(2)}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[12px] font-semibold text-slate-500">Total</span>
                  <span className="num text-[13.5px] font-bold text-accent-700">
                    {vpi.toFixed(3)}
                  </span>
                </div>
              </div>
            </Card>

            <ChartCard
              title="Component profile vs best-in-class"
              subtitle="Your live input against Epsilon_Group (VPI 0.857)"
              height={268}
              footer={
                <Legend
                  items={[
                    { color: PALETTE.accent, label: "Your supplier" },
                    { color: PALETTE.navySoft, label: "Epsilon_Group (best)" },
                  ]}
                />
              }
            >
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke={PALETTE.grid} />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: PALETTE.axis, fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#cbd5e1", fontSize: 9 }} axisLine={false} />
                <Tooltip content={<ChartTooltip formatter={(v) => `${Number(v).toFixed(1)}`} />} />
                <Radar
                  name="Epsilon_Group"
                  dataKey="best"
                  stroke={PALETTE.navySoft}
                  fill={PALETTE.navySoft}
                  fillOpacity={0.12}
                  strokeWidth={1.8}
                />
                <Radar
                  name="Your supplier"
                  dataKey="you"
                  stroke={PALETTE.accent}
                  fill={PALETTE.accent}
                  fillOpacity={0.24}
                  strokeWidth={2.2}
                />
              </RadarChart>
            </ChartCard>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <ChartCard
          title="VPI comparison across the supplier pool"
          subtitle="Five benchmark suppliers plus your live input — the bar updates as you move a slider"
          height={330}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Legend
                items={[
                  { color: PALETTE.accent, label: "Your supplier" },
                  { color: PALETTE.navySoft, label: "Benchmark supplier" },
                  { color: PALETTE.good, label: "Auto-RFQ threshold (0.78)", dashed: true },
                ]}
              />
              <span className="num text-slate-400">Currently ranked {rank} of {comparison.length}</span>
            </div>
          }
        >
          <BarChart data={comparison} margin={{ top: 20, right: 22, left: -10, bottom: 4 }} barSize={44}>
            <CartesianGrid vertical={false} stroke={PALETTE.grid} />
            <XAxis dataKey="name" {...AXIS_PROPS} interval={0} />
            <YAxis {...AXIS_PROPS} domain={[0, 1]} />
            <Tooltip
              cursor={CURSOR_FILL}
              content={<ChartTooltip formatter={(v) => `VPI ${Number(v).toFixed(3)}`} />}
            />
            <ReferenceLine y={0.78} stroke={PALETTE.good} strokeDasharray="5 4" />
            <Bar dataKey="vpi" name="VPI" radius={[5, 5, 0, 0]}>
              {comparison.map((d) => (
                <Cell key={d.fullName} fill={d.you ? PALETTE.accent : PALETTE.navySoft} />
              ))}
              <LabelList
                dataKey="vpi"
                position="top"
                formatter={(v: any) => Number(v).toFixed(3)}
                style={{ fill: PALETTE.axis, fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ChartCard>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="What the benchmark pool tells us"
          subtitle="Two findings that a price-only comparison would have missed entirely."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="card-pad border-emerald-200 bg-emerald-50/50">
            <Badge tone="good">Best overall</Badge>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-navy-900">
              Epsilon_Group — VPI 0.857
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              The strongest supplier on the two heaviest components: the lowest defect rate in the
              pool at <span className="font-semibold text-navy-900">5.5%</span> and{" "}
              <span className="font-semibold text-navy-900">91% compliance</span> across every PO
              raised. It does not offer the cheapest price — and still wins.
            </p>
          </Card>

          <Card className="card-pad border-rose-200 bg-rose-50/40">
            <Badge tone="bad">Price alone is misleading</Badge>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-navy-900">
              Delta_Logistics — VPI 0.699
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Delta posts the most competitive pricing in the pool, which is exactly why an informal
              selection process keeps awarding it orders. Its{" "}
              <span className="font-semibold text-navy-900">9.2% defect rate</span> and{" "}
              <span className="font-semibold text-navy-900">72% delivery rate</span> drag it to last
              place once quality and timing are weighted properly.
            </p>
          </Card>

          <Card className="card-pad">
            <Badge tone="dark">Automation</Badge>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-navy-900">
              Auto-RFQ sent to top-3 suppliers on forecast trigger
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              When the demand forecast crosses a reorder point, an RFQ is generated automatically
              and dispatched to the three highest-VPI suppliers — no manual shortlisting step.
            </p>
            <div className="mt-4 space-y-1.5">
              {top3.map((s, i) => (
                <div
                  key={s.fullName}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-[12.5px] ring-1 ring-inset",
                    s.you
                      ? "bg-accent-50 text-accent-800 ring-accent-200"
                      : "bg-slate-50 text-navy-900 ring-slate-200",
                  )}
                >
                  <span className="num font-bold text-slate-400">{i + 1}</span>
                  <span className="font-semibold">{s.fullName}</span>
                  <span className="num ml-auto font-semibold">{s.vpi.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
