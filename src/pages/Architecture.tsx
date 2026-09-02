import { useState } from "react";
import { ARCHITECTURE_LAYERS } from "../data/project";
import { Badge, Card, PageHeader, Section, SectionTitle } from "../components/ui";
import { cn } from "../utils/cn";

function FlowArrow() {
  return (
    <div className="flex justify-center py-1.5" aria-hidden>
      <svg viewBox="0 0 16 26" className="h-6 w-4 text-slate-300">
        <path d="M8 0v18" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
        <path d="M3.5 17 8 23l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function Architecture() {
  const [openId, setOpenId] = useState<string>("ml");

  return (
    <>
      <PageHeader
        eyebrow="System Architecture"
        title="Five layers, from raw CSV to an automated purchase decision"
        lead="VendorIQ is designed so the only thing an MSME must provide is the files it already keeps. Every layer below is expandable — select one to inspect its components and stack."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="dark">Zero ERP Dependency</Badge>
            <Badge tone="accent">CSV-native ingestion</Badge>
            <Badge tone="neutral">Event-driven alerts</Badge>
          </div>
        }
      />

      <Section>
        <SectionTitle
          title="Interactive layer stack"
          subtitle="Data flows top to bottom. Click any layer to expand its components."
          right={
            <button
              onClick={() => setOpenId("")}
              className="rounded-md bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/20"
            >
              Collapse all
            </button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* Stack */}
          <div>
            {ARCHITECTURE_LAYERS.map((layer, i) => {
              const open = openId === layer.id;
              return (
                <div key={layer.id}>
                  <div
                    className={cn(
                      "card overflow-hidden transition-all duration-200",
                      open ? "border-accent-300 ring-1 ring-accent-200" : "hover:border-slate-300",
                    )}
                  >
                    <button
                      onClick={() => setOpenId(open ? "" : layer.id)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left"
                      aria-expanded={open}
                    >
                      <span
                        className={cn(
                          "num flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors",
                          open ? "bg-accent-600 text-white" : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {layer.index}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold tracking-tight text-navy-900">
                          {layer.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] text-slate-500">
                          {layer.subtitle}
                        </span>
                      </span>
                      <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
                        {layer.components.slice(0, 3).map((c) => (
                          <span
                            key={c.name}
                            className="h-1.5 w-1.5 rounded-full bg-accent-200"
                          />
                        ))}
                        <span className="num ml-1 text-[11px] text-slate-400">
                          {layer.components.length} modules
                        </span>
                      </span>
                      <svg
                        viewBox="0 0 20 20"
                        className={cn(
                          "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                          open && "rotate-180",
                        )}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                          <p className="max-w-2xl text-[13.5px] leading-relaxed text-slate-600">
                            {layer.description}
                          </p>
                          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                            {layer.components.map((c) => (
                              <div
                                key={c.name}
                                className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                                <span>
                                  <span className="block text-[13px] font-semibold text-navy-900">
                                    {c.name}
                                  </span>
                                  <span className="block text-[11.5px] text-slate-500">{c.note}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {layer.stack.map((s) => (
                              <span
                                key={s}
                                className="rounded-md bg-navy-900/5 px-2 py-1 font-mono text-[11px] text-navy-700 ring-1 ring-inset ring-navy-900/10"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {i < ARCHITECTURE_LAYERS.length - 1 && <FlowArrow />}
                </div>
              );
            })}
          </div>

          {/* Side panel */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="card-pad bg-navy-900 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-300">
                Design principle
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">Zero ERP Dependency</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-slate-300">
                Every competing system in the literature assumes an existing ERP with clean master
                data. Over 90% of Indian MSMEs have neither. VendorIQ treats the CSV export as the
                primary interface, so the platform can be adopted on day one with no migration
                project.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { k: "Integration effort", v: "CSV upload" },
                  { k: "Master-data prereq", v: "None" },
                  { k: "Alert latency", v: "Real-time" },
                  { k: "Model tracking", v: "MLflow" },
                ].map((x) => (
                  <div key={x.k} className="rounded-lg bg-white/5 px-3 py-2.5 ring-1 ring-inset ring-white/10">
                    <div className="text-[13px] font-semibold text-white">{x.v}</div>
                    <div className="mt-0.5 text-[11px] text-slate-400">{x.k}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="card-pad">
              <h3 className="text-sm font-semibold tracking-tight text-navy-900">
                End-to-end request path
              </h3>
              <ol className="mt-4 space-y-3">
                {[
                  "Buyer uploads a purchase-order CSV to the ingestion endpoint.",
                  "Records are normalised and persisted to PostgreSQL; unstructured QC logs go to MongoDB.",
                  "A Celery worker runs feature engineering, the XGBoost risk score and the demand ensemble.",
                  "The Intelligence Layer recomputes VPI and evaluates reorder thresholds.",
                  "A WebSocket alert lands on the dashboard and an Auto-RFQ is queued for the top-3 suppliers.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="num mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-50 text-[10.5px] font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-relaxed text-slate-600">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
