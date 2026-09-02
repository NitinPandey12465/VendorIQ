import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  DATASET_INSIGHTS,
  DATASET_STATS,
  ENGINEERED_FEATURES,
  LEAD_TIME_HIST,
  ORDER_STATUS,
  PREPROCESSING_STEPS,
  SUPPLIERS,
} from "../data/project";
import { Badge, Card, Formula, PageHeader, Section, SectionTitle, StatCard } from "../components/ui";
import {
  AXIS_PROPS,
  ChartCard,
  ChartTooltip,
  CURSOR_FILL,
  Legend,
  PALETTE,
} from "../components/charts";
import { cn } from "../utils/cn";

const STATUS_COLORS = [PALETTE.accent, PALETTE.bad, PALETTE.warn, PALETTE.slate];
const TOTAL_ORDERS = ORDER_STATUS.reduce((a, b) => a + b.value, 0);

function OrderStatusChart() {
  const [mode, setMode] = useState<"donut" | "bar">("donut");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggle = (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
      {(["donut", "bar"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-[11.5px] font-semibold capitalize transition-colors",
            mode === m ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-navy-900",
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );

  return (
    <ChartCard
      title="Order Status Distribution"
      subtitle={`${TOTAL_ORDERS} purchase orders, Jan 2022 – Jan 2024`}
      action={toggle}
      height={272}
      footer={
        <span>
          71.4% of POs were delivered in full. The 140 cancellations and 55 partial deliveries form
          the positive class the classifier is trained to anticipate.
        </span>
      }
    >
      {mode === "donut" ? (
        <PieChart>
          <Tooltip
            content={
              <ChartTooltip
                formatter={(v) => `${v} POs · ${((Number(v) / TOTAL_ORDERS) * 100).toFixed(1)}%`}
              />
            }
          />
          <Pie
            data={ORDER_STATUS}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={95}
            paddingAngle={2}
            stroke="#fff"
            strokeWidth={2}
            onMouseEnter={(_: any, i: number) => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {ORDER_STATUS.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[i]}
                opacity={activeIdx === null || activeIdx === i ? 1 : 0.45}
              />
            ))}
            <Label
              position="center"
              content={(props: any) => {
                const vb = props?.viewBox ?? {};
                const cx = vb.cx ?? 0;
                const cy = vb.cy ?? 0;
                const big = activeIdx === null ? TOTAL_ORDERS : ORDER_STATUS[activeIdx].value;
                const small = activeIdx === null ? "Total POs" : ORDER_STATUS[activeIdx].name;
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy - 4}
                      textAnchor="middle"
                      fill={PALETTE.navy}
                      style={{ fontSize: 25, fontWeight: 600 }}
                    >
                      {big}
                    </text>
                    <text
                      x={cx}
                      y={cy + 16}
                      textAnchor="middle"
                      fill={PALETTE.axis}
                      style={{ fontSize: 11 }}
                    >
                      {small}
                    </text>
                  </g>
                );
              }}
            />
          </Pie>
        </PieChart>
      ) : (
        <BarChart data={ORDER_STATUS} margin={{ top: 12, right: 20, left: -12, bottom: 0 }} barSize={38}>
          <CartesianGrid vertical={false} stroke={PALETTE.grid} />
          <XAxis dataKey="name" {...AXIS_PROPS} interval={0} tick={{ fontSize: 10.5, fill: PALETTE.axis }} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip
            cursor={CURSOR_FILL}
            content={<ChartTooltip formatter={(v) => `${v} POs`} />}
          />
          <Bar dataKey="value" name="Orders" radius={[5, 5, 0, 0]}>
            {ORDER_STATUS.map((e, i) => (
              <Cell key={e.name} fill={STATUS_COLORS[i]} />
            ))}
            <LabelList dataKey="value" position="top" style={{ fill: PALETTE.axis, fontSize: 11 }} />
          </Bar>
        </BarChart>
      )}
    </ChartCard>
  );
}

function SupplierMetricChart({ metric }: { metric: "deliveryRate" | "defectRate" }) {
  const [sortBest, setSortBest] = useState(true);
  const isDelivery = metric === "deliveryRate";
  const data = sortBest
    ? [...SUPPLIERS].sort((a, b) =>
        isDelivery ? b.deliveryRate - a.deliveryRate : a.defectRate - b.defectRate,
      )
    : [...SUPPLIERS];

  return (
    <ChartCard
      title={isDelivery ? "Supplier Delivery Rate" : "Average Defect Rate by Supplier"}
      subtitle={
        isDelivery
          ? "% of POs delivered within the contracted window"
          : "% of received units rejected at goods receipt"
      }
      height={272}
      action={
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
          {[
            { k: true, l: "Best first" },
            { k: false, l: "A–Z" },
          ].map((m) => (
            <button
              key={String(m.k)}
              onClick={() => setSortBest(m.k)}
              className={cn(
                "rounded-[6px] px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                sortBest === m.k
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-slate-500 hover:text-navy-900",
              )}
            >
              {m.l}
            </button>
          ))}
        </div>
      }
      footer={
        isDelivery ? (
          <span>
            Epsilon leads at 84% and Delta trails at 72% — a 12-point spread across only five
            suppliers.
          </span>
        ) : (
          <span>
            Epsilon rejects least (5.5%); Delta rejects most (9.2%) despite offering the most
            competitive pricing.
          </span>
        )
      }
    >
      <BarChart data={data} margin={{ top: 14, right: 20, left: -14, bottom: 0 }} barSize={34}>
        <CartesianGrid vertical={false} stroke={PALETTE.grid} />
        <XAxis dataKey="short" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} domain={isDelivery ? [0, 100] : [0, 12]} unit="%" />
        <Tooltip cursor={CURSOR_FILL} content={<ChartTooltip formatter={(v) => `${v}%`} />} />
        <Bar
          dataKey={metric}
          name={isDelivery ? "Delivery rate" : "Defect rate"}
          radius={[5, 5, 0, 0]}
        >
          {data.map((d) => {
            const best = isDelivery ? d.deliveryRate === 84 : d.defectRate === 5.5;
            const worst = isDelivery ? d.deliveryRate === 72 : d.defectRate === 9.2;
            return (
              <Cell
                key={d.supplier}
                fill={best ? PALETTE.good : worst ? PALETTE.bad : PALETTE.accentPale}
              />
            );
          })}
          <LabelList
            dataKey={metric}
            position="top"
            formatter={(v: any) => `${v}%`}
            style={{ fill: PALETTE.axis, fontSize: 11 }}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function LeadTimeChart() {
  return (
    <ChartCard
      title="Lead Time Distribution"
      subtitle="Mean 16.3 days · bimodal — 14d commodity peak, 21d specialty peak"
      height={272}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Legend
            items={[
              { color: PALETTE.accent, label: "Purchase orders" },
              { color: PALETTE.bad, label: "Mean 16.3 days", dashed: true },
            ]}
          />
          <span className="num text-slate-400">n = 312 orders with recorded lead time</span>
        </div>
      }
    >
      <AreaChart data={LEAD_TIME_HIST} margin={{ top: 12, right: 20, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="ltFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.accent} stopOpacity={0.28} />
            <stop offset="100%" stopColor={PALETTE.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={PALETTE.grid} />
        <XAxis dataKey="bucket" {...AXIS_PROPS} interval={0} />
        <YAxis {...AXIS_PROPS} />
        <Tooltip content={<ChartTooltip formatter={(v) => `${v} orders`} />} />
        <ReferenceLine
          x="15-18d"
          stroke={PALETTE.bad}
          strokeDasharray="4 4"
          label={{ value: "μ = 16.3d", position: "top", fill: PALETTE.bad, fontSize: 11 }}
        />
        <Area
          type="monotone"
          dataKey="orders"
          name="Orders"
          stroke={PALETTE.accent}
          strokeWidth={2.4}
          fill="url(#ltFill)"
          dot={{ r: 3.5, fill: "#fff", stroke: PALETTE.accent, strokeWidth: 2 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartCard>
  );
}

export default function Dataset() {
  return (
    <>
      <PageHeader
        eyebrow="Dataset & Insights"
        title="777 purchase orders, five suppliers, twenty-four months"
        lead="Exploratory analysis of the procurement dataset that trains every model in the platform. All charts below are interactive — hover for exact values."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Jan 2022 – Jan 2024</Badge>
            <Badge tone="neutral">6 item categories</Badge>
            <Badge tone="neutral">11 features per record</Badge>
          </div>
        }
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DATASET_STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Exploratory data analysis"
          subtitle="Four views of the same 777 records: outcome mix, supplier performance and delivery timing."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <OrderStatusChart />
          <SupplierMetricChart metric="deliveryRate" />
          <SupplierMetricChart metric="defectRate" />
          <LeadTimeChart />

          <Card className="flex flex-col lg:col-span-2">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold tracking-tight text-navy-900">
                Supplier scorecard
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Delivery rate against defect rate — sorted by VPI
              </p>
            </div>
            <div className="grid flex-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...SUPPLIERS]
                .sort((a, b) => b.vpi - a.vpi)
                .map((s) => (
                  <div
                    key={s.supplier}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
                  >
                    <span className="w-16 shrink-0 text-[13px] font-semibold text-navy-900">
                      {s.short}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Delivery</span>
                        <span className="num font-semibold text-navy-900">{s.deliveryRate}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-accent-500"
                          style={{ width: `${s.deliveryRate}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Defects</span>
                        <span className="num font-semibold text-navy-900">{s.defectRate}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-rose-400"
                          style={{ width: `${(s.defectRate / 12) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="num w-14 shrink-0 rounded-md bg-slate-50 py-1 text-center text-[12.5px] font-semibold text-navy-900 ring-1 ring-inset ring-slate-200">
                      {s.vpi.toFixed(3)}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Key dataset insights"
          subtitle="What the exploratory pass established before any model was fitted."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DATASET_INSIGHTS.map((ins, i) => (
            <Card key={ins.headline} className="card-pad">
              <span className="num text-[11px] font-semibold text-accent-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[14px] font-semibold tracking-tight text-navy-900">
                {ins.headline}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{ins.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Feature engineering"
          subtitle="Three derived features carry 57% of total model gain between them."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {ENGINEERED_FEATURES.map((f) => (
            <Card key={f.name} className="card-pad flex flex-col">
              <code className="font-mono text-[13px] font-semibold text-accent-700">{f.name}</code>
              <div className="mt-3">
                <Formula label="Definition">{f.formula}</Formula>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{f.why}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Preprocessing pipeline"
          subtitle="Every transform is fitted on the training fold only, then applied to the held-out fold."
        />
        <Card className="overflow-x-auto">
          <div className="flex min-w-max items-stretch gap-0 p-5">
            {PREPROCESSING_STEPS.map((s, i) => (
              <div key={s.step} className="flex items-stretch">
                <div className="w-[190px] rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="num flex h-5 w-5 items-center justify-center rounded-md bg-accent-600 text-[10.5px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[12.5px] font-semibold text-navy-900">{s.step}</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-slate-500">{s.note}</p>
                </div>
                {i < PREPROCESSING_STEPS.length - 1 && (
                  <div className="flex items-center px-2" aria-hidden>
                    <svg viewBox="0 0 24 12" className="h-3 w-6 text-slate-300">
                      <path d="M0 6h18" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
                      <path d="M16 2l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-xs text-white/75">
          SMOTE-NC is applied only inside the training fold, lifting the minority class from a
          85/15 split to 50/50 without leaking synthetic samples into evaluation.
        </p>
      </Section>
    </>
  );
}
