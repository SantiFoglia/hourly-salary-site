import { calcFromHourly, formatMoney } from "@/lib/calc";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function parseRateFromSlug(slug: string) {
  const match = slug.match(/^how-much-is-(\d+(?:\.\d+)?)-an-hour$/);
  if (!match) return null;

  const rate = Number(match[1]);
  if (!Number.isFinite(rate) || rate <= 0 || rate > 500) return null;

  return rate;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const rate = parseRateFromSlug(slug);
  if (rate === null) notFound();

  const r = calcFromHourly({ hourlyRate: rate, hoursPerWeek: 40, weeksPerYear: 52 });

  return (
    <>
      <section className="hero card">
        <h1>How much is ${rate}/hour per year?</h1>
        <p>
          If you make <b>${rate}/hour</b> and work <b>40 hours/week</b> for <b>52 weeks</b>, your gross yearly pay is{" "}
          <b>{formatMoney(r.yearly)}</b>.
        </p>
      </section>

      <section className="grid">
        <section className="results card">
          <h2>Breakdown</h2>

          <div className="kpis">
            <div className="kpi">
              <div className="label">Daily</div>
              <div className="value">{formatMoney(r.daily)}</div>
              <div className="hint">8 hours/day estimate</div>
            </div>

            <div className="kpi">
              <div className="label">Weekly</div>
              <div className="value">{formatMoney(r.weekly)}</div>
              <div className="hint">${rate} × 40 hours</div>
            </div>

            <div className="kpi">
              <div className="label">Biweekly</div>
              <div className="value">{formatMoney(r.biweekly)}</div>
              <div className="hint">Two-week estimate</div>
            </div>

            <div className="kpi">
              <div className="label">Monthly</div>
              <div className="value">{formatMoney(r.monthly)}</div>
              <div className="hint">Yearly ÷ 12</div>
            </div>

            <div className="kpi" style={{ gridColumn: "1 / -1", borderColor: "rgba(34,197,94,0.35)" }}>
              <div className="label">Yearly (gross)</div>
              <div className="value">{formatMoney(r.yearly)}</div>
              <div className="hint">${rate} × 40 × 52</div>
            </div>
          </div>

          <p style={{ marginTop: 16 }} className="small">
            Note: This is a gross estimate. Taxes and deductions vary widely.
          </p>

          <p style={{ marginTop: 16 }}>
            <Link href="/">← Back to calculator</Link>
          </p>
        </section>

        <aside className="section card">
          <h2>Related hourly wages</h2>
          <p>Quick links around this rate.</p>

          <div className="linksGrid">
            {[rate - 2, rate - 1, rate + 1, rate + 2]
              .filter((x) => Number.isFinite(x) && x > 0)
              .map((x) => (
                <a key={x} className="linkCard" href={`/how-much-is-${x}-an-hour`}>
                  <b>${x}/hour</b>
                  <div className="small">View breakdown →</div>
                </a>
              ))}
          </div>
        </aside>
      </section>
    </>
  );
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let i = 10; i <= 100; i++) {
    params.push({ slug: `how-much-is-${i}-an-hour` });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const rate = parseRateFromSlug(slug);
  if (rate === null) return {};

  return {
    title: `How much is $${rate} an hour per year?`,
    description: `Convert $${rate}/hour into weekly, biweekly, monthly and yearly pay (gross).`,
  };
}
