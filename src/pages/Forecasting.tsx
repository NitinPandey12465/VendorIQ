import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FORECAST_PIPELINE, FORECAST_SERIES, FORECAST_STATS } from "../data/project";
import { Badge, Card, Formula, PageHeader, Section, SectionTitle, StatCard } from "../components/ui";
import { AXIS_PROPS, ChartCard, Legend, PALETTE } from "../components/charts";
import { cn } from "../utils/cn";

const STEP_ICONS: Record<string, string> = {
  data: "M4 6h16M4 12h16M4 18h10",
  features: "M12 3v18M3 12h18",
  lstm: "M4 17c3 0 3-10 6-10s3 10 6 10 4-4 4-4",
  prophet: "M4 18l4-7 4 3 4-9 4 6",
  ensemble: "M6 4v6a4 4 0 0 0 4 4h8M6 20v-6",
  signal: "M12 3v9m0 0 4-4m-4 4-4-4M4 17v3h16v-3",
};

function PipelineDiagram() {
  const [active, setActive] = useState<string>("ensemble");

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight text-navy-900">
          LSTM–Prophet hybrid pipeline
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Select any stage to inspect it. The two model branches run in parallel and are fused by
          the ensemble combiner.
        </p>
      </div>

      <div className="p-5">
        {/* Row 1: sequential intake */}
        <div className="grid gap-3 sm:grid-cols-2">
          {FORECAST_PIPELINE.slice(0, 2).map((s) => (
            <StageBox key={s.id} s={s} active={active} setActive={setActive} tone="intake" />
          ))}
        </div>

        <Connector label="parallel branch" />

        {/* Row 2: two model branches */}
        <div className="grid gap-3 sm:grid-cols-2">
          {FORECAST_PIPELINE.slice(2, 4).map((s) => (
            <StageBox key={s.id} s={s} active={active} setActive={setActive} tone="model" />
          ))}
        </div>

        <Connector label="inverse-RMSE fusion" />

        {/* Row 3 & 4 */}
        <div className="grid gap-3">
          {FORECAST_PIPELINE.slice(4).map((s, i) => (
            <div key={s.id}>
              <StageBox s={s} active={active} setActive={setActive} tone={i === 0 ? "fuse" : "out"} />
              {i === 0 && <Connector label="threshold check" />}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-3" aria-hidden>
      <div className="h-px flex-1 bg-slate-200" />
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function StageBox({
  s,
  active,
  setActive,
  tone,
}: {
  s: (typeof FORECAST_PIPELINE)[number];
  active: string;
  setActive: (id: string) => void;
  tone: "intake" | "model" | "fuse" | "out";
}) {
  const isActive = active === s.id;
  const tones = {
    intake: "bg-slate-50 border-slate-200",
    model: "bg-accent-50/60 border-accent-200",
    fuse: "bg-navy-900 border-navy-900 text-white",
    out: "bg-emerald-50/70 border-emerald-200",
  };
  return (
    <button
      onClick={() => setActive(s.id)}
      className={cn(
        "w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
        tones[tone],
        isActive
          ? "ring-2 ring-accent-400 ring-offset-1"
          : "hover:border-slate-300 hover:shadow-[0_10px_26px_-18px_rgba(10,22,40,0.6)]",
      )}
      aria-expanded={isActive}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            tone === "fuse" ? "bg-white/10 text-accent-200" : "bg-white text-accent-600 ring-1 ring-inset ring-slate-200",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d={STEP_ICONS[s.id]} />
          </svg>
        </span>
        <span className={cn("text-[13.5px] font-semibold", tone === "fuse" ? "text-white" : "text-navy-900")}>
          {s.title}
        </span>
      </div>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isActive ? "mt-2.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "text-[12.5px] leading-relaxed",
              tone === "fuse" ? "text-slate-300" : "text-slate-600",
            )}
          >
            {s.detail}
          </p>
        </div>
      </div>
    </button>
  );
}

function ForecastTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload ?? {};
  const rows = [
    row.actual != null ? { k: "Actual", v: `${Number(row.actual).toLocaleString()} units`, c: PALETTE.navy } : null,
    { k: "Ensemble forecast", v: `${Number(row.forecast).toLocaleString()} units`, c: PALETTE.accent },
    {
      k: "95% interval",
      v: `${Number(row.lower).toLocaleString()} – ${Number(row.upper).toLocaleString()}`,
      c: PALETTE.accentPale,
    },
  ].filter(Boolean) as { k: string; v: string; c: string }[];

  return (
    <div className="pointer-events-none rounded-lg border border-slate-200 bg-white/98 px-3 py-2 shadow-[0_12px_32px_-12px_rgba(10,22,40,0.35)]">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {String(label)}
      </div>
      <div className="space-y-1">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: r.c }} />
            <span className="text-slate-600">{r.k}</span>
            <span className="num ml-auto font-semibold text-navy-900">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ForecastChart() {
  const band = FORECAST_SERIES.map((d) => ({ ...d, band: d.upper - d.lower }));
  return (
    <ChartCard
      title="Ensemble demand forecast with 95% confidence interval"
      subtitle="Monthly aggregated demand — actuals to October, ensemble projection beyond"
      height={340}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Legend
            items={[
              { color: PALETTE.navy, label: "Actual demand" },
              { color: PALETTE.accent, label: "Ensemble forecast" },
              { color: PALETTE.accentPale, label: "95% confidence band" },
            ]}
          />
          <span className="num text-slate-400">Units / month</span>
        </div>
      }
    >
      <ComposedChart data={band} margin={{ top: 12, right: 20, left: -8, bottom: 4 }}>
        <defs>
          <linearGradient id="ciFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.accentSoft} stopOpacity={0.26} />
            <stop offset="100%" stopColor={PALETTE.accentSoft} stopOpacity={0.06} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={PALETTE.grid} />
        <XAxis dataKey="month" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} domain={[1100, 2200]} />
        <Tooltip content={<ForecastTooltip />} />
        <ReferenceLine
          x="Oct"
          stroke={PALETTE.slate}
          strokeDasharray="4 4"
          label={{ value: "forecast horizon", position: "top", fill: PALETTE.axis, fontSize: 10.5 }}
        />
        <Area
          type="monotone"
          dataKey="lower"
          name="ci-base"
          stackId="ci"
          stroke="none"
          fill="none"
          isAnimationActive={false}
          legendType="none"
        />
        <Area
          type="monotone"
          dataKey="band"
          name="95% CI"
          stackId="ci"
          stroke="none"
          fill="url(#ciFill)"
          isAnimationActive={false}
          legendType="none"
        />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Ensemble forecast"
          stroke={PALETTE.accent}
          strokeWidth={2.4}
          strokeDasharray="6 3"
          dot={{ r: 3, fill: "#fff", stroke: PALETTE.accent, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke={PALETTE.navy}
          strokeWidth={2.4}
          dot={{ r: 3, fill: PALETTE.navy }}
          connectNulls={false}
        />
      </ComposedChart>
    </ChartCard>
  );
}

export default function Forecasting() {
  return (
    <>
      <PageHeader
        eyebrow="Demand Forecasting"
        title="A hybrid forecaster that reorders before the shortage, not after it"
        lead="Prophet contributes interpretable trend, seasonality and holiday structure; the LSTM captures the non-linear short-horizon behaviour Prophet misses. An inverse-RMSE weighted combiner fuses the two into a single reorder signal."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">LSTM (64 + 32 units)</Badge>
            <Badge tone="neutral">Prophet additive model</Badge>
            <Badge tone="dark">Auto-RFQ trigger</Badge>
          </div>
        }
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FORECAST_STATS.map((s, i) => (
            <StatCard key={s.label} {...s} accent={i === 0} />
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <PipelineDiagram />

          <div className="space-y-4">
            <ForecastChart />

            <Card className="card-pad">
              <p className="eyebrow">Prophet decomposition</p>
              <div className="mt-3">
                <Formula label="Additive model">y(t) = g(t) + s(t) + h(t) + ε(t)</Formula>
              </div>
              <dl className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {[
                  { t: "g(t)", d: "Trend — piecewise growth with automatic changepoint detection." },
                  { t: "s(t)", d: "Seasonality — yearly and weekly Fourier terms." },
                  { t: "h(t)", d: "Holidays — festival and shutdown effects specific to Indian manufacturing calendars." },
                  { t: "ε(t)", d: "Error — the irreducible noise term assumed normally distributed." },
                ].map((x) => (
                  <div key={x.t} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <dt className="font-mono text-[12.5px] font-bold text-accent-700">{x.t}</dt>
                    <dd className="mt-1 text-[12px] leading-relaxed text-slate-600">{x.d}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="How the two branches combine"
          subtitle="Neither model wins outright — the combiner lets validation RMSE decide the split."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="card-pad">
            <Badge tone="accent">Branch A</Badge>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-navy-900">LSTM</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Two stacked recurrent layers of 64 and 32 units with 0.2 dropout between them, trained
              on a rolling 30-day window. Learns the abrupt, non-linear demand shifts that follow
              production-schedule changes.
            </p>
            <ul className="mt-4 space-y-1.5 text-[12.5px] text-slate-500">
              <li>• Input window: 30 days</li>
              <li>• Architecture: LSTM(64) → Dropout → LSTM(32) → Dropout → Dense(1)</li>
              <li>• Optimiser: Adam, early stopping on validation loss</li>
            </ul>
          </Card>

          <Card className="card-pad">
            <Badge tone="accent">Branch B</Badge>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-navy-900">Prophet</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              An additive decomposition that stays legible to a procurement manager: the trend,
              seasonal and holiday components can each be read off independently and challenged.
            </p>
            <ul className="mt-4 space-y-1.5 text-[12.5px] text-slate-500">
              <li>• Yearly + weekly seasonality enabled</li>
              <li>• Daily seasonality disabled (order-level data is not intraday)</li>
              <li>• Produces the 95% interval carried through to the reorder logic</li>
            </ul>
          </Card>

          <Card className="card-pad bg-navy-900 text-white">
            <span className="inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-200">
              Combiner
            </span>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
              Inverse-RMSE weighted average
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
              Each branch receives a weight proportional to the reciprocal of its validation RMSE,
              so the more accurate model dominates without ever silencing the other.
            </p>
            <div className="mt-4 rounded-lg bg-black/25 px-3.5 py-3">
              <code className="block font-mono text-[12.5px] leading-relaxed text-slate-100">
                w_i = (1 / RMSE_i) ÷ Σ (1 / RMSE_j)
                <br />
                ŷ = w_prophet · ŷ_prophet + w_lstm · ŷ_lstm
              </code>
            </div>
            <p className="mt-3 text-[12px] text-slate-400">
              Output feeds the reorder point directly — a crossing raises an alert and queues an
              Auto-RFQ to the top-3 VPI suppliers.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
