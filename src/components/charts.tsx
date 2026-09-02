import type { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "../utils/cn";

export const PALETTE = {
  accent: "#0b8059",
  accentSoft: "#33b788",
  accentPale: "#a4e6cb",
  navy: "#072a21",
  navySoft: "#17604b",
  slate: "#94a3b8",
  slateLight: "#cbd5e1",
  good: "#1f9d3f",
  warn: "#e0932a",
  bad: "#d1425a",
  grid: "#e6eeea",
  axis: "#64748b",
};

/** Hover highlight used by every Recharts <Tooltip cursor={...}> on the site. */
export const CURSOR_FILL = { fill: "rgba(11,128,89,0.07)" };

export const SERIES_COLORS = [
  PALETTE.accent,
  PALETTE.accentSoft,
  PALETTE.navySoft,
  PALETTE.slate,
  PALETTE.accentPale,
  PALETTE.navy,
];

export const AXIS_PROPS = {
  tickLine: false,
  axisLine: { stroke: PALETTE.grid },
  tick: { fill: PALETTE.axis, fontSize: 11 },
} as const;

/** Shared tooltip that matches the product's card styling. */
export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelSuffix = "",
}: {
  active?: boolean;
  payload?: any[];
  label?: any;
  formatter?: (value: any, name: string) => string;
  labelSuffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="pointer-events-none rounded-lg border border-slate-200 bg-white/98 px-3 py-2 shadow-[0_12px_32px_-12px_rgba(10,22,40,0.35)] backdrop-blur">
      {label !== undefined && label !== null && label !== "" && (
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {String(label)}
          {labelSuffix}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, i) => {
          if (entry.value === null || entry.value === undefined) return null;
          const name = entry.name ?? entry.dataKey ?? "";
          return (
            <div key={i} className="flex items-center gap-2 text-[12.5px]">
              <span
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ background: entry.color ?? entry.payload?.fill ?? PALETTE.accent }}
              />
              <span className="text-slate-600">{String(name)}</span>
              <span className="num ml-auto font-semibold text-navy-900">
                {formatter ? formatter(entry.value, String(name)) : String(entry.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartCard({
  title,
  subtitle,
  children,
  height = 300,
  footer,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  footer?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card flex flex-col", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-navy-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="px-2 py-4 sm:px-3">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children as any}
          </ResponsiveContainer>
        </div>
      </div>
      {footer && (
        <div className="border-t border-slate-100 px-5 py-3 text-xs leading-relaxed text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}

export function Legend({
  items,
}: {
  items: { color: string; label: string; dashed?: boolean }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-xs text-slate-600">
          {it.dashed ? (
            <span
              className="h-0 w-4 border-t-2 border-dashed"
              style={{ borderColor: it.color }}
            />
          ) : (
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: it.color }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}
