import { useMemo, useState } from "react";
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
import { ABC_CLASSES, ALERT_CHANNELS } from "../data/project";
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

function NumberField({
  label,
  unit,
  value,
  onChange,
  min = 0,
  step = 1,
  hint,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-[12.5px] font-medium text-navy-900">{label}</span>
        <span className="text-[11px] text-slate-400">{unit}</span>
      </span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(Math.max(min, n));
        }}
        className="num mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] font-semibold text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
      />
      {hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

function EoqCalculator() {
  const [demand, setDemand] = useState(18500); // D — annual demand (units)
  const [orderCost, setOrderCost] = useState(1200); // S — ordering cost per order (₹)
  const [holdCost, setHoldCost] = useState(46); // H — holding cost per unit per year (₹)
  const [leadTime, setLeadTime] = useState(16.3); // days
  const [safety, setSafety] = useState(420); // safety stock units

  const { eoq, ordersPerYear, cycleDays, ddlt, rop, annualCost } = useMemo(() => {
    const e = holdCost > 0 ? Math.sqrt((2 * demand * orderCost) / holdCost) : 0;
    const n = e > 0 ? demand / e : 0;
    const daily = demand / 365;
    const d = daily * leadTime;
    return {
      eoq: e,
      ordersPerYear: n,
      cycleDays: n > 0 ? 365 / n : 0,
      ddlt: d,
      rop: d + safety,
      annualCost: e > 0 ? (demand / e) * orderCost + (e / 2) * holdCost : 0,
    };
  }, [demand, orderCost, holdCost, leadTime, safety]);

  const fmt = (n: number, dp = 0) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: dp, minimumFractionDigits: dp });

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight text-navy-900">
          EOQ & reorder-point calculator
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Change any input — the order quantity, reorder point and annual cost recompute instantly.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <NumberField label="Annual demand (D)" unit="units / yr" value={demand} onChange={setDemand} step={100} />
        <NumberField label="Ordering cost (S)" unit="₹ / order" value={orderCost} onChange={setOrderCost} step={50} />
        <NumberField label="Holding cost (H)" unit="₹ / unit / yr" value={holdCost} onChange={setHoldCost} step={1} />
        <NumberField
          label="Lead time"
          unit="days"
          value={leadTime}
          onChange={setLeadTime}
          step={0.1}
          hint="Dataset mean is 16.3 days"
        />
        <NumberField label="Safety stock" unit="units" value={safety} onChange={setSafety} step={10} />
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Daily demand</div>
          <div className="num mt-1 text-[15px] font-semibold text-navy-900">
            {fmt(demand / 365, 1)} units/day
          </div>
          <div className="mt-2 text-[11px] leading-relaxed text-slate-500">
            Derived from annual demand ÷ 365 and used for demand-during-lead-time.
          </div>
        </div>
      </div>

      <div className="grid gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "Economic Order Quantity", v: `${fmt(eoq)} units`, accent: true },
          { k: "Reorder Point (ROP)", v: `${fmt(rop)} units`, accent: true },
          { k: "Orders per year", v: fmt(ordersPerYear, 1) },
          { k: "Order cycle", v: `${fmt(cycleDays, 1)} days` },
        ].map((m) => (
          <div key={m.k} className="bg-white px-5 py-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">{m.k}</div>
            <div
              className={cn(
                "num mt-1 text-[1.35rem] font-semibold tracking-tight",
                m.accent ? "text-accent-700" : "text-navy-900",
              )}
            >
              {m.v}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-[12.5px]">
        <span className="text-slate-600">
          Demand during lead time ={" "}
          <span className="num font-semibold text-navy-900">{fmt(ddlt)} units</span> · Safety stock ={" "}
          <span className="num font-semibold text-navy-900">{fmt(safety)} units</span>
        </span>
        <span className="text-slate-600">
          Total annual inventory cost ={" "}
          <span className="num font-semibold text-navy-900">₹{fmt(annualCost)}</span>
        </span>
      </div>
    </Card>
  );
}

function AbcChart() {
  const [selected, setSelected] = useState<string>("A");
  const data = ABC_CLASSES.map((c) => ({
    name: `Class ${c.cls}`,
    cls: c.cls,
    skus: c.skus,
    value: c.value,
  }));

  const active = ABC_CLASSES.find((c) => c.cls === selected)!;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      <ChartCard
        title="ABC classification — SKU share vs value share"
        subtitle="Click a class in the panel to highlight it"
        height={300}
        footer={
          <Legend
            items={[
              { color: PALETTE.navySoft, label: "% of SKUs" },
              { color: PALETTE.accent, label: "% of inventory value" },
            ]}
          />
        }
      >
        <BarChart data={data} margin={{ top: 18, right: 20, left: -10, bottom: 4 }} barSize={34}>
          <CartesianGrid vertical={false} stroke={PALETTE.grid} />
          <XAxis dataKey="name" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} domain={[0, 100]} unit="%" />
          <Tooltip cursor={CURSOR_FILL} content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <Bar dataKey="skus" name="% of SKUs" radius={[5, 5, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.cls}
                fill={PALETTE.navySoft}
                opacity={selected === d.cls ? 1 : 0.35}
              />
            ))}
            <LabelList dataKey="skus" position="top" formatter={(v: any) => `${v}%`} style={{ fill: PALETTE.axis, fontSize: 10.5 }} />
          </Bar>
          <Bar dataKey="value" name="% of value" radius={[5, 5, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.cls} fill={PALETTE.accent} opacity={selected === d.cls ? 1 : 0.35} />
            ))}
            <LabelList dataKey="value" position="top" formatter={(v: any) => `${v}%`} style={{ fill: PALETTE.axis, fontSize: 10.5 }} />
          </Bar>
        </BarChart>
      </ChartCard>

      <div className="space-y-3">
        {ABC_CLASSES.map((c) => {
          const on = selected === c.cls;
          return (
            <button
              key={c.cls}
              onClick={() => setSelected(c.cls)}
              className={cn(
                "card w-full px-5 py-4 text-left transition-all duration-200",
                on ? "border-accent-300 ring-1 ring-accent-200" : "hover:border-slate-300",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-[15px] font-bold",
                    on ? "bg-accent-600 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {c.cls}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13.5px] font-semibold text-navy-900">
                      Class {c.cls}
                    </span>
                    <span className="text-[11.5px] font-semibold uppercase tracking-wider text-accent-600">
                      {c.control}
                    </span>
                  </div>
                  <div className="num mt-0.5 text-[12px] text-slate-500">
                    {c.skus}% of SKUs · {c.value}% of value
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  on ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-slate-100 pt-3 text-[12.5px] leading-relaxed text-slate-600">
                    {c.detail}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
        <p className="px-1 text-[11.5px] leading-relaxed text-white/75">
          Currently viewing <span className="font-semibold text-white">Class {active.cls}</span> —{" "}
          {active.skus}% of stock-keeping units carrying {active.value}% of total inventory value.
        </p>
      </div>
    </div>
  );
}

export default function Inventory() {
  return (
    <>
      <PageHeader
        eyebrow="Inventory & EOQ"
        title="Order the right quantity, at the right moment, for the right class of item"
        lead="Classical inventory theory, wired directly into the forecast. EOQ sets the quantity, the Wilson-formula reorder point sets the timing, and ABC classification decides how tightly each SKU is policed."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Interactive calculator</Badge>
            <Badge tone="neutral">ABC-differentiated control</Badge>
            <Badge tone="dark">5 alert channels</Badge>
          </div>
        }
      />

      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="card-pad">
            <p className="eyebrow">Economic Order Quantity</p>
            <div className="mt-3">
              <Formula label="Wilson EOQ">EOQ = √( 2·D·S / H )</Formula>
            </div>
            <dl className="mt-4 space-y-2 text-[12.5px]">
              {[
                { t: "D", d: "Annual demand in units — supplied by the LSTM–Prophet ensemble rather than a historical average." },
                { t: "S", d: "Fixed cost of placing one order — paperwork, inspection setup and inbound freight." },
                { t: "H", d: "Cost of holding one unit for one year — capital, storage and obsolescence." },
              ].map((x) => (
                <div key={x.t} className="flex gap-3">
                  <dt className="w-5 shrink-0 font-mono font-bold text-accent-700">{x.t}</dt>
                  <dd className="text-slate-600">{x.d}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="card-pad">
            <p className="eyebrow">Reorder Point</p>
            <div className="mt-3">
              <Formula label="Trigger level">
                ROP = Demand During Lead Time + Safety Stock
              </Formula>
            </div>
            <dl className="mt-4 space-y-2 text-[12.5px]">
              {[
                { t: "DDLT", d: "Average daily demand × lead time in days. The dataset's mean lead time is 16.3 days with a bimodal 14d/21d split." },
                { t: "SS", d: "Buffer sized against demand variability and the 95% confidence interval produced by the forecaster." },
                { t: "Trigger", d: "Crossing the ROP raises a multi-channel alert and queues an Auto-RFQ to the top-3 VPI suppliers." },
              ].map((x) => (
                <div key={x.t} className="flex gap-3">
                  <dt className="w-12 shrink-0 font-mono font-bold text-accent-700">{x.t}</dt>
                  <dd className="text-slate-600">{x.d}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </Section>

      <Section className="pt-0">
        <EoqCalculator />
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="ABC classification"
          subtitle="Control effort is allocated where the value sits — not spread evenly across every SKU."
        />
        <AbcChart />
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Multi-channel alert system"
          subtitle="Every reorder signal fans out across the channels appropriate to the item's class."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALERT_CHANNELS.map((a, i) => (
            <Card key={a.title} className="card-pad flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
                    <path d="M10.3 20a2 2 0 0 0 3.4 0" />
                  </svg>
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                  {a.tag}
                </span>
              </div>
              <h3 className="mt-4 text-[14px] font-semibold tracking-tight text-navy-900">
                {a.title}
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">{a.detail}</p>
              <span className="num mt-auto pt-4 text-[11px] text-slate-300">
                CH-{String(i + 1).padStart(2, "0")}
              </span>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
