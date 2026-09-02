import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CONCLUSION_METRICS,
  IMPACT_CARDS,
  RESEARCH_CONTRIBUTIONS,
} from "../data/project";
import { Badge, Button, Card, PageHeader, Section, SectionTitle } from "../components/ui";
import {
  AXIS_PROPS,
  ChartCard,
  ChartTooltip,
  CURSOR_FILL,
  Legend,
  PALETTE,
} from "../components/charts";

const IMPACT_RANGES = [
  { area: "Procurement cost", low: 15, high: 20 },
  { area: "Production downtime", low: 40, high: 40 },
  { area: "Inventory carrying cost", low: 0, high: 25 },
];

const IMPACT_ICONS = [
  "M3 17l6-6 4 4 8-8M21 7v5h-5",
  "M12 8v5l3 2M21 12a9 9 0 1 1-9-9",
  "M4 7l8-4 8 4v10l-8 4-8-4V7Zm8-4v18M4 7l8 4 8-4",
];

function ImpactChart() {
  const data = IMPACT_RANGES.map((r) => ({
    ...r,
    base: r.low,
    span: r.high - r.low,
    label: r.low === r.high ? `~${r.high}%` : r.low === 0 ? `up to ${r.high}%` : `${r.low}–${r.high}%`,
  }));

  return (
    <ChartCard
      title="Projected operational impact"
      subtitle="Modelled improvement ranges from the platform's three intervention points"
      height={280}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Legend
            items={[
              { color: PALETTE.accent, label: "Lower bound" },
              { color: PALETTE.accentPale, label: "Upper bound of the range" },
            ]}
          />
          <span className="text-slate-400">Projections, not measured post-deployment results.</span>
        </div>
      }
    >
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 62, left: 62, bottom: 4 }}
        barSize={30}
      >
        <CartesianGrid horizontal={false} stroke={PALETTE.grid} />
        <XAxis type="number" domain={[0, 50]} unit="%" {...AXIS_PROPS} />
        <YAxis
          type="category"
          dataKey="area"
          width={148}
          {...AXIS_PROPS}
          tick={{ fontSize: 11, fill: PALETTE.axis }}
        />
        <Tooltip cursor={CURSOR_FILL} content={<ChartTooltip formatter={(v) => `${v}%`} />} />
        <Bar dataKey="base" name="Lower bound" stackId="a" radius={[4, 0, 0, 4]}>
          {data.map((d) => (
            <Cell key={d.area} fill={PALETTE.accent} />
          ))}
        </Bar>
        <Bar dataKey="span" name="Upper range" stackId="a" radius={[0, 4, 4, 0]}>
          {data.map((d) => (
            <Cell key={d.area} fill={PALETTE.accentPale} />
          ))}
          <LabelList
            dataKey="label"
            position="right"
            style={{ fill: PALETTE.axis, fontSize: 11, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

export default function Impact() {
  return (
    <>
      <PageHeader
        eyebrow="Impact & Results"
        title="What changes when procurement stops being a guess"
        lead="Three intervention points — supplier selection, reorder timing and order sizing — each attack a different component of the ₹2.5 lakh crore annual loss carried by the Indian MSME sector."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="good">90.03% classifier accuracy</Badge>
            <Badge tone="accent">Zero ERP dependency</Badge>
            <Badge tone="neutral">CSV-native adoption</Badge>
          </div>
        }
      />

      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {IMPACT_CARDS.map((c, i) => (
            <Card key={c.title} className="card-pad relative overflow-hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={IMPACT_ICONS[i]} />
                </svg>
              </span>
              <div className="num mt-5 text-[2.6rem] font-semibold leading-none tracking-tight text-navy-900">
                {c.value}
              </div>
              <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-navy-900">
                {c.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{c.driver}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          <ImpactChart />

          <Card className="card-pad flex flex-col justify-center bg-navy-900 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-300">
              Combined impact
            </p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-[1.75rem]">
              Addressing the{" "}
              <span className="text-accent-300">₹2.5 lakh crore</span> annual MSME procurement loss
              through a zero-ERP, CSV-native platform.
            </h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-slate-300">
              The three failure modes identified at the outset — forecasting gaps, informal vendor
              selection and reactive reordering — are each addressed by a distinct module that
              operates on files an MSME already produces. No ERP licence, no migration project, no
              master-data cleanup phase.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "63M", k: "enterprises addressable" },
                { v: "110M+", k: "workers affected" },
                { v: "30%", k: "of national GDP" },
              ].map((x) => (
                <div key={x.k} className="rounded-lg bg-white/5 px-3 py-3 ring-1 ring-inset ring-white/10">
                  <div className="num text-[17px] font-semibold text-white">{x.v}</div>
                  <div className="mt-1 text-[11px] leading-tight text-slate-400">{x.k}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="pt-0">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold tracking-tight text-navy-900">
              Final conclusion metrics
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              The four headline numbers that define the delivered system.
            </p>
          </div>
          <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {CONCLUSION_METRICS.map((m, i) => (
              <div
                key={m.label}
                className={`px-6 py-8 text-center ${i % 2 === 1 ? "sm:border-l sm:border-slate-100" : ""}`}
              >
                <div className="num text-[2.2rem] font-semibold leading-none tracking-tight text-accent-700">
                  {m.value}
                </div>
                <div className="mt-2.5 text-[12.5px] font-medium text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Research contributions"
          subtitle="Four claims this project makes against the existing literature."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {RESEARCH_CONTRIBUTIONS.map((c) => (
            <Card key={c.n} className="card-pad flex gap-4">
              <span className="num text-[2rem] font-semibold leading-none tracking-tight text-accent-200">
                {c.n}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-navy-900">
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{c.body}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button to="/models" variant="secondary">
            Review the model benchmark
          </Button>
          <Button to="/vpi">Open the VPI Calculator</Button>
        </div>
      </Section>
    </>
  );
}
