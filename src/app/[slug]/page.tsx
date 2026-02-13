import { calcFromHourly, formatMoney } from "@/lib/calc";
import { notFound } from "next/navigation";

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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildRelatedRates(rate: number) {
  // Armamos links cercanos + algunos "comunes"
  const near = [
    rate - 5,
    rate - 2,
    rate - 1,
    rate + 1,
    rate + 2,
    rate + 5,
  ]
    .map((x) => clamp(Math.round(x), 1, 500))
    .filter((x, idx, arr) => x !== rate && arr.indexOf(x) === idx);

  const common = [10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 100].filter((x) => x !== rate);

  // Evitamos duplicados y limitamos
  const all = Array.from(new Set([...near, ...common])).slice(0, 12);
  return all;
}

function faqItems(rate: number) {
  const yearly = calcFromHourly({ hourlyRate: rate, hoursPerWeek: 40, weeksPerYear: 52 }).yearly;
  return [
    {
      q: `How much is $${rate}/hour per year (gross)?`,
      a: `At 40 hours per week and 52 weeks per year, $${rate}/hour is approximately ${formatMoney(
        yearly
      )} per year (gross).`,
    },
    {
      q: "Does this include taxes?",
      a: "No. These are gross (pre-tax) estimates. Net pay depends on taxes, deductions, and your location.",
    },
    {
      q: "What if I work fewer weeks per year?",
      a: "Use the calculator on the home page to set your weeks per year (for example 48, 50, or 52).",
    },
    {
      q: "What if I work part-time?",
      a: "Use the calculator to set your hours per week (for example 20 or 30 hours).",
    },
    {
      q: "Is biweekly pay always exactly 2× weekly?",
      a: "In this estimate, yes. Real payroll can vary depending on pay periods, overtime, and benefits.",
    },
  ];
}

function faqJsonLd(rate: number) {
  const faqs = faqItems(rate);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function webPageJsonLd(rate: number) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `How much is $${rate} an hour per year?`,
    description: `Convert $${rate}/hour into daily, weekly, biweekly, monthly and yearly gross pay.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const rate = parseRateFromSlug(slug);
  if (rate === null) notFound();

  const hoursPerWeek = 40;
  const weeksPerYear = 52;
  const r = calcFromHourly({ hourlyRate: rate, hoursPerWeek, weeksPerYear });

  const related = buildRelatedRates(rate);

  return (
    <main className="container main">
      {/* JSON-LD (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd(rate)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(rate)) }}
      />

      {/* HERO */}
      <section className="hero card">
        <h1>How much is ${rate}/hour per year?</h1>
        <p>
          If you make <b>${rate}/hour</b> and work <b>{hoursPerWeek}</b> hours per week for{" "}
          <b>{weeksPerYear}</b> weeks, your estimated <b>gross yearly pay</b> is{" "}
          <b>{formatMoney(r.yearly)}</b>.
        </p>
        <p className="small" style={{ marginTop: 10 }}>
          Want a custom estimate? Try the full calculator (hours/week, weeks/year).
        </p>
        <p style={{ marginTop: 10 }}>
          <a href="/" className="badge" style={{ display: "inline-block" }}>
            Back to calculator
          </a>
        </p>
      </section>

      {/* GRID: Breakdown + Notes */}
      <div className="grid">
        <section className="results card">
          <h2>Breakdown (gross)</h2>

          <div className="kpis">
            <div className="kpi">
              <div className="label">Daily</div>
              <div className="value">{formatMoney(r.daily)}</div>
              <div className="hint">Assumes 8-hour workday</div>
            </div>

            <div className="kpi">
              <div className="label">Weekly</div>
              <div className="value">{formatMoney(r.weekly)}</div>
              <div className="hint">{hoursPerWeek} hours/week</div>
            </div>

            <div className="kpi">
              <div className="label">Biweekly</div>
              <div className="value">{formatMoney(r.biweekly)}</div>
              <div className="hint">2× weekly estimate</div>
            </div>

            <div className="kpi">
              <div className="label">Monthly</div>
              <div className="value">{formatMoney(r.monthly)}</div>
              <div className="hint">Yearly ÷ 12</div>
            </div>

            <div className="kpi" style={{ gridColumn: "1 / -1" }}>
              <div className="label">Yearly</div>
              <div className="value">{formatMoney(r.yearly)}</div>
              <div className="hint">{weeksPerYear} weeks/year</div>
            </div>
          </div>
        </section>

        <section className="section card">
          <h2>What this means</h2>
          <p>
            Hourly rates can be confusing because your real take-home pay depends on taxes, benefits, overtime,
            bonuses, and where you live. This page shows a <b>simple gross estimate</b> to help you compare
            offers quickly.
          </p>

          <h2 style={{ marginTop: 14 }}>Common use cases</h2>
          <ul style={{ lineHeight: 1.9, color: "var(--muted)", margin: "10px 0 0", paddingLeft: 18 }}>
            <li>Job offers (hourly → yearly)</li>
            <li>Contractor rates (budget planning)</li>
            <li>Part-time vs full-time comparisons</li>
          </ul>
        </section>
      </div>

      {/* SEO TEXT SECTION */}
      <section className="section card">
        <h2>How to calculate ${rate}/hour per year</h2>
        <p>
          The basic formula is:
          <br />
          <b>Hourly rate × hours per week × weeks per year</b>.
        </p>
        <p>
          For <b>${rate}/hour</b>, with <b>{hoursPerWeek}</b> hours/week and <b>{weeksPerYear}</b> weeks/year:
          <br />
          <b>
            ${rate} × {hoursPerWeek} × {weeksPerYear} = {formatMoney(r.yearly)}
          </b>
          .
        </p>

        <h2 style={{ marginTop: 16 }}>Gross vs net pay</h2>
        <p>
          This website shows <b>gross</b> estimates (before taxes). Your net salary can be lower depending on
          deductions and local tax rules. If you need a precise number, consult a tax professional.
        </p>
      </section>

      {/* FAQ */}
      <section className="section card">
        <h2>FAQ</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {faqItems(rate).map((f) => (
            <div key={f.q} className="kpi">
              <div className="value" style={{ fontSize: 16 }}>
                {f.q}
              </div>
              <div className="hint" style={{ fontSize: 13, marginTop: 8, color: "var(--muted)" }}>
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related rates */}
      <section className="section card">
        <h2>Related hourly wages</h2>
        <p className="small">
          Explore similar hourly rates to compare salary outcomes quickly.
        </p>

        <div className="linksGrid">
          {related.map((x) => (
            <a key={x} className="linkCard" href={`/how-much-is-${x}-an-hour`}>
              How much is <b>${x}/hour</b> per year?
              <div className="small" style={{ marginTop: 6 }}>
                Estimate gross salary
              </div>
            </a>
          ))}
        </div>

        <p className="small" style={{ marginTop: 12 }}>
          Need a custom schedule? Go back to the <a href="/">calculator</a>.
        </p>
      </section>
    </main>
  );
}

/** Static pages for SEO (pre-render 10..100) */
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

  const canonical = `https://hourly-salary-site.vercel.app/${slug}`;

  return {
    title: `How much is $${rate} an hour per year? (Salary Calculator)`,
    description: `Convert $${rate}/hour into daily, weekly, biweekly, monthly and yearly gross pay. Quick estimate and FAQ.`,
    alternates: { canonical },
    openGraph: {
      title: `How much is $${rate} an hour per year?`,
      description: `Gross pay estimate for $${rate}/hour with breakdown (daily, weekly, biweekly, monthly, yearly).`,
      url: canonical,
      type: "article",
    },
  };
}
