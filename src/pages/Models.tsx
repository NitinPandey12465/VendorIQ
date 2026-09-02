import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FEATURE_IMPORTANCE,
  MODEL_BENCHMARK,
  ORACLE_BASELINE,
  OVERFIT_CHECK,
  SOTA_COMPARISON,
  TOP_MODELS,
} from "../data/project";
import { Badge, Card, PageHeader, Section, SectionTitle } from "../components/ui";
import {
  AXIS_PROPS,
  ChartCard,
  ChartTooltip,
  CURSOR_FILL,
  Legend,
  PALETTE,
} from "../components/charts";
import { cn } from "../utils/cn";

type Metric = "accuracy" | "f1" | "auc";

const METRIC_META: Record<Metric, { label: string; suffix: string; domain: [number, number]; fmt: (v: number) => string }> = {
  accuracy: { label: "Accuracy", suffix: "%", domain: [0, 100], fmt: (v) => `${v.toFixed(2)}%` },
  f1: { label: "F1-Score", suffix: "", domain: [0, 1], fmt: (v) => v.toFixed(3) },
  auc: { label: "AUC-ROC", suffix: "", domain: [0, 1], fmt: (v) => v.toFixed(3) },
};

function BenchmarkChart() {
  const data = [...MODEL_BENCHMARK].sort((a, b) => b.accuracy - a.accuracy);
  return (
    <ChartCard
      title="Nine-classifier accuracy benchmark"
      subtitle="Test-set accuracy on identical stratified folds, against the Oracle AI baseline"
      height={380}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Legend
            items={[
              { color: PALETTE.accent, label: "Selected model (XGBoost)" },
              { color: PALETTE.accentPale, label: "Other classifiers" },
              { color: PALETTE.bad, label: `Oracle AI baseline (${ORACLE_BASELINE}%)`, dashed: true },
            ]}
          />
          <span className="num text-slate-400">Higher is better</span>
        </div>
      }
    >
      <BarChart data={data} margin={{ top: 18, right: 24, left: -8, bottom: 62 }} barSize={34}>
        <CartesianGrid vertical={false} stroke={PALETTE.grid} />
        <XAxis
          dataKey="model"
          {...AXIS_PROPS}
          interval={0}
          angle={-32}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 10.5, fill: PALETTE.axis }}
        />
        <YAxis {...AXIS_PROPS} domain={[0, 100]} unit="%" />
        <Tooltip
          cursor={CURSOR_FILL}
          content={<ChartTooltip formatter={(v) => `${Number(v).toFixed(2)}%`} />}
        />
        <ReferenceLine
          y={ORACLE_BASELINE}
          stroke={PALETTE.bad}
          strokeDasharray="5 4"
          strokeWidth={1.6}
          label={{
            value: `Oracle AI ${ORACLE_BASELINE}%`,
            position: "insideTopRight",
            fill: PALETTE.bad,
            fontSize: 11,
            fontWeight: 600,
          }}
        />
        <Bar dataKey="accuracy" name="Test accuracy" radius={[5, 5, 0, 0]}>
          {data.map((d) => (
            <Cell
              key={d.model}
              fill={
                d.model === "XGBoost"
                  ? PALETTE.accent
                  : d.accuracy >= ORACLE_BASELINE
                    ? PALETTE.accentSoft
                    : PALETTE.accentPale
              }
            />
          ))}
          <LabelList
            dataKey="accuracy"
            position="top"
            formatter={(v: any) => Number(v).toFixed(2)}
            style={{ fill: PALETTE.axis, fontSize: 10.5 }}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function AucChart() {
  const data = [...MODEL_BENCHMARK].sort((a, b) => a.auc - b.auc);
  return (
    <ChartCard
      title="AUC-ROC across all nine classifiers"
      subtitle="Ranking discrimination independent of the decision threshold"
      height={340}
      footer={
        <span>
          XGBoost (0.935) and Random Forest (0.931) separate the classes almost identically; the
          linear and probabilistic baselines fall below 0.70.
        </span>
      }
    >
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 44, left: 46, bottom: 4 }}
        barSize={19}
      >
        <CartesianGrid horizontal={false} stroke={PALETTE.grid} />
        <XAxis type="number" domain={[0, 1]} {...AXIS_PROPS} />
        <YAxis
          type="category"
          dataKey="model"
          {...AXIS_PROPS}
          width={104}
          tick={{ fontSize: 10.5, fill: PALETTE.axis }}
        />
        <Tooltip
          cursor={CURSOR_FILL}
          content={<ChartTooltip formatter={(v) => Number(v).toFixed(3)} />}
        />
        <ReferenceLine x={0.93} stroke={PALETTE.bad} strokeDasharray="5 4" />
        <Bar dataKey="auc" name="AUC-ROC" radius={[0, 4, 4, 0]}>
          {data.map((d) => (
            <Cell key={d.model} fill={d.model === "XGBoost" ? PALETTE.accent : PALETTE.accentPale} />
          ))}
          <LabelList
            dataKey="auc"
            position="right"
            formatter={(v: any) => Number(v).toFixed(3)}
            style={{ fill: PALETTE.axis, fontSize: 10.5 }}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function FeatureImportanceChart() {
  return (
    <ChartCard
      title="Feature importance (XGBoost gain)"
      subtitle="Total gain contributed by each feature, normalised to 1.0"
      height={340}
      footer={
        <span>
          Quality dominates: <code className="font-mono text-navy-900">defect_rate_perc</code> alone
          carries 31% of total gain — three times the weight of lead time.
        </span>
      }
    >
      <BarChart
        layout="vertical"
        data={FEATURE_IMPORTANCE}
        margin={{ top: 4, right: 44, left: 62, bottom: 4 }}
        barSize={15}
      >
        <CartesianGrid horizontal={false} stroke={PALETTE.grid} />
        <XAxis type="number" domain={[0, 0.35]} {...AXIS_PROPS} />
        <YAxis
          type="category"
          dataKey="feature"
          {...AXIS_PROPS}
          width={122}
          tick={{ fontSize: 10, fill: PALETTE.axis }}
        />
        <Tooltip
          cursor={CURSOR_FILL}
          content={<ChartTooltip formatter={(v) => `gain ${Number(v).toFixed(2)}`} />}
        />
        <Bar dataKey="gain" name="Gain" radius={[0, 4, 4, 0]}>
          {FEATURE_IMPORTANCE.map((d, i) => (
            <Cell key={d.feature} fill={i < 4 ? PALETTE.accent : PALETTE.accentPale} />
          ))}
          <LabelList
            dataKey="gain"
            position="right"
            formatter={(v: any) => Number(v).toFixed(2)}
            style={{ fill: PALETTE.axis, fontSize: 10.5 }}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function OverfitChart() {
  return (
    <ChartCard
      title="Train vs test accuracy — overfitting check"
      subtitle="Gap between the fitted fold and the held-out fold"
      height={340}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Legend
            items={[
              { color: PALETTE.navySoft, label: "Train accuracy" },
              { color: PALETTE.accent, label: "Test accuracy" },
            ]}
          />
          <span className="text-slate-400">
            Three models hit 100% on train — a known limitation, documented on the About page.
          </span>
        </div>
      }
    >
      <BarChart data={OVERFIT_CHECK} margin={{ top: 16, right: 20, left: -10, bottom: 40 }} barSize={22}>
        <CartesianGrid vertical={false} stroke={PALETTE.grid} />
        <XAxis
          dataKey="model"
          {...AXIS_PROPS}
          interval={0}
          angle={-22}
          textAnchor="end"
          height={54}
          tick={{ fontSize: 10.5, fill: PALETTE.axis }}
        />
        <YAxis {...AXIS_PROPS} domain={[0, 105]} unit="%" />
        <Tooltip
          cursor={CURSOR_FILL}
          content={<ChartTooltip formatter={(v) => `${Number(v).toFixed(2)}%`} />}
        />
        <Bar dataKey="train" name="Train" fill={PALETTE.navySoft} radius={[4, 4, 0, 0]} />
        <Bar dataKey="test" name="Test" fill={PALETTE.accent} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}

function TopModelCards() {
  const [metric, setMetric] = useState<Metric>("accuracy");
  const meta = METRIC_META[metric];

  return (
    <>
      <SectionTitle
        title="Top three models"
        subtitle="Toggle the headline metric to compare the shortlisted classifiers on the same axis."
        right={
          <div className="inline-flex rounded-lg bg-white/12 p-0.5 ring-1 ring-inset ring-white/25 backdrop-blur">
            {(Object.keys(METRIC_META) as Metric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={cn(
                  "rounded-[6px] px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  metric === m
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-white/75 hover:text-white",
                )}
              >
                {METRIC_META[m].label}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {TOP_MODELS.map((m, i) => {
          const value = m[metric] as number;
          const pct = metric === "accuracy" ? value : value * 100;
          const best = i === 0;
          return (
            <Card
              key={m.model}
              className={cn("card-pad", best && "border-accent-300 ring-1 ring-accent-200")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-navy-900">
                    {m.model}
                  </h3>
                  <p className="mt-0.5 text-[11.5px] uppercase tracking-wider text-slate-400">
                    {m.rank}
                  </p>
                </div>
                {best && <Badge tone="accent">Deployed</Badge>}
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span
                  className={cn(
                    "num text-[2.4rem] font-semibold leading-none tracking-tight",
                    best ? "text-accent-700" : "text-navy-900",
                  )}
                >
                  {meta.fmt(value)}
                </span>
                <span className="mb-1 text-[12px] font-medium text-slate-500">{meta.label}</span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn("h-full rounded-full transition-[width] duration-500 ease-out", best ? "bg-accent-600" : "bg-accent-300")}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                {[
                  { k: "Accuracy", v: `${m.accuracy.toFixed(2)}%` },
                  { k: "F1", v: m.f1.toFixed(3) },
                  { k: "AUC", v: m.auc.toFixed(3) },
                ].map((x) => (
                  <div key={x.k}>
                    <dt className="text-[10.5px] uppercase tracking-wider text-slate-400">{x.k}</dt>
                    <dd className="num mt-0.5 text-[13.5px] font-semibold text-navy-900">{x.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-[12.5px] leading-relaxed text-slate-600">{m.note}</p>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default function Models() {
  return (
    <>
      <PageHeader
        eyebrow="ML Models & Results"
        title="Nine classifiers, one benchmark, a 90.03% winner"
        lead="Every model was trained on the same SMOTE-NC balanced fold and evaluated on the same 25% stratified hold-out. The charts below are live — hover any bar for exact values."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">XGBoost selected</Badge>
            <Badge tone="good">Beats Oracle AI by 1.03 pts</Badge>
            <Badge tone="neutral">75-25 stratified split</Badge>
          </div>
        }
      />

      <Section>
        <BenchmarkChart />
      </Section>

      <Section className="pt-0">
        <TopModelCards />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          <FeatureImportanceChart />
          <AucChart />
        </div>
      </Section>

      <Section className="pt-0">
        <OverfitChart />
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Comparison with state-of-the-art research"
          subtitle="Reported accuracy and AUC against published procurement-prediction systems."
        />
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-semibold">System / Study</th>
                  <th className="px-5 py-3 font-semibold">Model</th>
                  <th className="px-5 py-3 font-semibold">Accuracy</th>
                  <th className="px-5 py-3 font-semibold">AUC-ROC</th>
                  <th className="px-5 py-3 font-semibold">ERP-Free</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SOTA_COMPARISON.map((r) => (
                  <tr
                    key={r.system}
                    className={cn(
                      "transition-colors",
                      r.ours ? "bg-accent-50/70" : "hover:bg-slate-50/70",
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "font-semibold",
                          r.ours ? "text-accent-800" : "text-navy-900",
                        )}
                      >
                        {r.system}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{r.model}</td>
                    <td className="num px-5 py-3.5 font-semibold text-navy-900">{r.accuracy}</td>
                    <td className="num px-5 py-3.5 text-slate-700">{r.auc}</td>
                    <td className="px-5 py-3.5">
                      {r.erpFree ? (
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-600">
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-400">
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" strokeLinecap="round" />
                          </svg>
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-xs text-white/75">
          VendorIQ is the only system in this comparison that achieves its result without an ERP
          integration prerequisite — the single largest adoption barrier for Indian MSMEs.
        </p>
      </Section>
    </>
  );
}
