import { LIMITATIONS, ROADMAP } from "../data/project";
import { Badge, Card, PageHeader, Section, SectionTitle } from "../components/ui";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About · Limitations & Future Work"
        title="What this system does not yet prove — stated plainly"
        lead="A benchmark result is only useful if its boundaries are declared. This page lists the constraints of the current study and the work queued to remove them."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">777 POs · 5 suppliers</Badge>
            <Badge tone="warn">24-month coverage</Badge>
            <Badge tone="accent">5 roadmap items</Badge>
          </div>
        }
      />

      <Section>
        <SectionTitle
          title="Current limitations"
          subtitle="Four constraints that bound every claim made elsewhere on this site."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {LIMITATIONS.map((l, i) => (
            <Card key={l.title} className="card-pad border-amber-200/80 bg-amber-50/40">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5 21 19H3L12 5Z" />
                    <path d="M12 10v4M12 16.5v.2" />
                  </svg>
                </span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="num text-[11px] font-semibold text-amber-600">
                      L{i + 1}
                    </span>
                    <h3 className="text-[14.5px] font-semibold tracking-tight text-navy-900">
                      {l.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{l.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          title="Future roadmap"
          subtitle="Ordered by how much each item would strengthen the central claim."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map((r, i) => (
            <Card key={r.title} className="card-pad flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="num text-[11px] font-semibold text-slate-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-md bg-accent-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-accent-700 ring-1 ring-inset ring-accent-200">
                  {r.tag}
                </span>
              </div>
              <h3 className="mt-3 text-[14.5px] font-semibold tracking-tight text-navy-900">
                {r.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{r.body}</p>
            </Card>
          ))}
        </div>
      </Section>

    </>
  );
}
