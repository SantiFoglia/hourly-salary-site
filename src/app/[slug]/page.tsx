import { calcFromHourly, formatMoney } from "@/lib/calc";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type SlugKind = "yearly" | "monthly" | "biweekly" | "weekly" | "daily" | "salary";

function parseSlug(slug: string): { rate: number; kind: SlugKind } | null {
  // ✅ Formato original:
  // how-much-is-20-an-hour  -> yearly
  let m = slug.match(/^how-much-is-(\d+(?:\.\d+)?)-an-hour$/);
  if (m) return { rate: Number(m[1]), kind: "yearly" };

  // ✅ Nuevos formatos SEO:
  // 20-an-hour-salary       -> salary (yearly)
  m = slug.match(/^(\d+(?:\.\d+)?)-an-hour-salary$/);
  if (m) return { rate: Number(m[1]), kind: "salary" };

  // 20-an-hour-per-month    -> monthly
  m = slug.match(/^(\d+(?:\.\d+)?)-an-hour-per-month$/);
  if (m) return { rate: Number(m[1]), kind: "monthly" };

  // 20-an-hour-biweekly     -> biweekly
  m = slug.match(/^(\d+(?:\.\d+)?)-an-hour-biweekly$/);
  if (m) return { rate: Number(m[1]), kind: "biweekly" };

  // 20-an-hour-weekly       -> weekly
  m = slug.match(/^(\d+(?:\.\d+)?)-an-hour-weekly$/);
  if (m) return { rate: Number(m[1]), kind: "weekly" };

  // 20-an-hour-daily        -> daily
  m = slug.match(/^(\d+(?:\.\d+)?)-an-hour-daily$/);
  if (m) return { rate: Number(m[1]), kind: "daily" };

  return null;
}

function isValidRate(rate: number) {
  return Number.isFinite(rate) && rate > 0 && rate <= 500;
}

function getPageCopy(rate: number, kind: SlugKind) {
  // Valores por defecto (podés cambiarlos si querés)
  const HOURS_PER_WEEK = 40;
  const WEEKS_PER_YEAR = 52;

  const base = {
    hoursPerWeek: HOURS_PER_WEEK,
    weeksPerYear: WEEKS_PER_YEAR,
  };

  // Títulos + descripción según la intención
  switch (kind) {
    case "monthly":
      return {
        h1: `How much is $${rate}/hour per month?`,
        intro: `If you make $${rate}/hour and work ${HOURS_PER_WEEK} hours per week for ${WEEKS_PER_YEAR} weeks, your gross monthly pay estimate is`,
        focusLabel: "Monthly",
        base,
      };
    case "biweekly":
      return {
        h1: `How much is $${rate}/hour biweekly?`,
        intro: `If you make $${rate}/hour and work ${HOURS_PER_WEEK} hours per week for ${WEEKS_PER_YEAR} weeks, your gross biweekly pay estimate is`,
        focusLabel: "Biweekly",
        base,
      };
    case "weekly":
      return {
        h1: `How much is $${rate}/hour per week?`,
        intro: `If you make $${rate}/hour and work ${HOURS_PER_WEEK} hours per week for ${WEEKS_PER_YEAR} weeks, your gross weekly pay estimate is`,
        focusLabel: "Weekly",
        base,
      };
    case "daily":
      return {
        h1: `How much is $${rate}/hour per day?`,
        intro: `If you make $${rate}/hour and assume an 8-hour workday, your gross daily pay estimate is`,
        focusLabel: "Daily",
        base,
      };
    case "salary":
      return {
        h1: `What salary is $${rate}/hour?`,
        intro: `If you make $${rate}/hour and work ${HOURS_PER_WEEK} hours per week for ${WEEKS_PER_YEAR} weeks, your gross yearly salary estimate is`,
        focusLabel: "Yearly",
        base,
      };
    case "yearly":
    default:
      return {
        h1: `How much is $${rate}/hour per year?`,
        intro: `If you make $${rate}/hour and work ${HOURS_PER_WEEK} hours per week for ${WEEKS_PER_YEAR} weeks, your gross yearly pay is`,
        focusLabel: "Yearly",
        base,
      };
  }
}

function getValueByKind(result: ReturnType<typeof calcFromHourly>, kind: SlugKind) {
  switch (kind) {
    case "monthly":
      return result.monthly;
    case "biweekly":
      return result.biweekly;
    case "weekly":
      return result.weekly;
    case "daily":
      return result.daily;
    case "salary":
    case "yearly":
    default:
      return result.yearly;
  }
}

function slugsForRate(rate: number) {
  return {
    yearly: `how-much-is-${rate}-an-hour`,
    salary: `${rate}-an-hour-salary`,
    monthly: `${rate}-an-hour-per-month`,
    biweekly: `${rate}-an-hour-biweekly`,
    weekly: `${rate}-an-hour-weekly`,
    daily: `${rate}-an-hour-daily`,
  };
}
function afterTaxSlugsForRate(rate: number) {
  return {
    yearly: `after-tax/${rate}-an-hour`,
    salary: `after-tax/${rate}-an-hour-salary`,
    monthly: `after-tax/${rate}-an-hour-per-month`,
    biweekly: `after-tax/${rate}-an-hour-biweekly`,
    weekly: `after-tax/${rate}-an-hour-weekly`,
    daily: `after-tax/${rate}-an-hour-daily`,
  };
}

function buildFaq(rate: number, kind: SlugKind) {
  const baseHours = 40;
  const baseWeeks = 52;
  const r = calcFromHourly({ hourlyRate: rate, hoursPerWeek: baseHours, weeksPerYear: baseWeeks });

  const focus =
    kind === "monthly"
      ? r.monthly
      : kind === "biweekly"
      ? r.biweekly
      : kind === "weekly"
      ? r.weekly
      : kind === "daily"
      ? r.daily
      : r.yearly;

  const focusLabel =
    kind === "monthly"
      ? "monthly"
      : kind === "biweekly"
      ? "biweekly"
      : kind === "weekly"
      ? "weekly"
      : kind === "daily"
      ? "daily"
      : "yearly";

  return [
    {
      q: `How much is $${rate}/hour ${focusLabel}?`,
      a: `With a standard assumption of 40 hours per week and 52 weeks per year, $${rate}/hour is about ${formatMoney(
        focus
      )} ${focusLabel} (gross).`,
    },
    {
      q: "Does this include taxes?",
      a: "No. These results are gross estimates (before taxes). Net pay depends on taxes, deductions, and your location.",
    },
    {
      q: "What if I work part-time?",
      a: "Use the calculator on the home page to set your hours per week (for example 20 or 30 hours).",
    },
    {
      q: "What if I don’t work 52 weeks per year?",
      a: "Use the calculator to adjust weeks per year (many people use 48–50 weeks to account for vacations/holidays).",
    },
    {
      q: "Is biweekly pay always exactly 2× weekly pay?",
      a: "In this estimate it is, but real payroll can vary depending on your employer’s pay schedule and overtime/benefits.",
    },
  ];
}

function faqJsonLd(rate: number, kind: SlugKind) {
  const faqs = buildFaq(rate, kind);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
function kindLabel(kind: SlugKind) {
  switch (kind) {
    case "monthly":
      return "Monthly";
    case "biweekly":
      return "Biweekly";
    case "weekly":
      return "Weekly";
    case "daily":
      return "Daily";
    case "salary":
      return "Salary";
    case "yearly":
    default:
      return "Yearly";
  }
}

function breadcrumbJsonLd(baseUrl: string, rate: number, kind: SlugKind, slug: string) {
  const label = kindLabel(kind);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `$${rate}/hour`,
        item: `${baseUrl}/how-much-is-${rate}-an-hour`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: label,
        item: `${baseUrl}/${slug}`,
      },
    ],
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const { rate, kind } = parsed;
  if (!isValidRate(rate)) notFound();

  const copy = getPageCopy(rate, kind);
  const r = calcFromHourly({ hourlyRate: rate, ...copy.base });
  const focusValue = getValueByKind(r, kind);
  const links = slugsForRate(rate);
  const afterTax = afterTaxSlugsForRate(rate);

  return (
  <main className="container main">
    <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(faqJsonLd(rate, kind)),
  }}
/>

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      breadcrumbJsonLd("https://hourly-salary-site.vercel.app", rate, kind, slug)
    ),
  }}
/>
    <section className="section card">
        <nav className="small" aria-label="Breadcrumb" style={{ marginBottom: 10 }}>
  <Link href="/" style={{ opacity: 0.9 }}>Home</Link>
  <span style={{ opacity: 0.6 }}> / </span>
  <Link href={`/${slugsForRate(rate).yearly}`} style={{ opacity: 0.9 }}>
    ${rate}/hour
  </Link>
  <span style={{ opacity: 0.6 }}> / </span>
  <span style={{ opacity: 0.9 }}>{kindLabel(kind)}</span>
</nav>

        <h1 style={{ marginTop: 0 }}>{copy.h1}</h1>

        <p>
          {copy.intro} <b>{formatMoney(focusValue)}</b>.
        </p>

        <h2 style={{ marginTop: 16 }}>Breakdown (gross)</h2>

        <div className="kpis">
          <div className="kpi">
            <div className="label">Daily</div>
            <div className="value">{formatMoney(r.daily)}</div>
            <div className="hint">Assumes 8-hour day</div>
          </div>

          <div className="kpi">
            <div className="label">Weekly</div>
            <div className="value">{formatMoney(r.weekly)}</div>
            <div className="hint">{copy.base.hoursPerWeek} hours/week</div>
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
            <div className="hint">{copy.base.weeksPerYear} weeks/year</div>
          </div>
        </div>

        <h2 style={{ marginTop: 18 }}>More pages for ${rate}/hour</h2>

<div className="linksGrid">
  {/* Gross cluster */}
  <Link className="linkCard" href={`/${links.yearly}`}>
    <b>Gross yearly page</b>
    <div className="small">{links.yearly}</div>
  </Link>

  <Link className="linkCard" href={`/${links.salary}`}>
    <b>Gross salary (yearly)</b>
    <div className="small">{links.salary}</div>
  </Link>

  <Link className="linkCard" href={`/${links.monthly}`}>
    <b>Gross monthly pay</b>
    <div className="small">{links.monthly}</div>
  </Link>

  <Link className="linkCard" href={`/${links.biweekly}`}>
    <b>Gross biweekly pay</b>
    <div className="small">{links.biweekly}</div>
  </Link>

  <Link className="linkCard" href={`/${links.weekly}`}>
    <b>Gross weekly pay</b>
    <div className="small">{links.weekly}</div>
  </Link>

  <Link className="linkCard" href={`/${links.daily}`}>
    <b>Gross daily pay</b>
    <div className="small">{links.daily}</div>
  </Link>

  {/* After-tax cluster */}
  <Link className="linkCard" href={`/${afterTax.yearly}`}>
    <b>After-tax (yearly)</b>
    <div className="small">{afterTax.yearly}</div>
  </Link>

  <Link className="linkCard" href={`/${afterTax.monthly}`}>
    <b>After-tax (monthly)</b>
    <div className="small">{afterTax.monthly}</div>
  </Link>

  <Link className="linkCard" href={`/${afterTax.weekly}`}>
    <b>After-tax (weekly)</b>
    <div className="small">{afterTax.weekly}</div>
  </Link>

  <Link className="linkCard" href={`/${afterTax.biweekly}`}>
    <b>After-tax (biweekly)</b>
    <div className="small">{afterTax.biweekly}</div>
  </Link>

  <Link className="linkCard" href={`/${afterTax.daily}`}>
    <b>After-tax (daily)</b>
    <div className="small">{afterTax.daily}</div>
  </Link>
</div>

<h2 style={{ marginTop: 18 }}>FAQ</h2>
<div style={{ display: "grid", gap: 12 }}>
  {buildFaq(rate, kind).map((f) => (
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
        <p style={{ marginTop: 18 }}>
          <Link href="/">← Back to calculator</Link>
        </p>
      </section>
    </main>
  );
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let i = 10; i <= 100; i++) {
    params.push({ slug: `how-much-is-${i}-an-hour` });
    params.push({ slug: `${i}-an-hour-salary` });
    params.push({ slug: `${i}-an-hour-per-month` });
    params.push({ slug: `${i}-an-hour-biweekly` });
    params.push({ slug: `${i}-an-hour-weekly` });
    params.push({ slug: `${i}-an-hour-daily` });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const parsed = parseSlug(slug);
  if (!parsed) return {};

  const { rate, kind } = parsed;
  if (!isValidRate(rate)) return {};

  const canonical = `https://hourly-salary-site.vercel.app/${slug}`;

  switch (kind) {
    case "monthly":
      return {
        title: `How much is $${rate} an hour per month?`,
        description: `Convert $${rate}/hour into monthly pay, plus weekly, biweekly and yearly gross estimates.`,
        alternates: { canonical },
      };
    case "biweekly":
      return {
        title: `How much is $${rate} an hour biweekly?`,
        description: `Convert $${rate}/hour into biweekly pay, plus daily, weekly, monthly and yearly gross estimates.`,
        alternates: { canonical },
      };
    case "weekly":
      return {
        title: `How much is $${rate} an hour per week?`,
        description: `Convert $${rate}/hour into weekly pay, plus daily, biweekly, monthly and yearly gross estimates.`,
        alternates: { canonical },
      };
    case "daily":
      return {
        title: `How much is $${rate} an hour per day?`,
        description: `Convert $${rate}/hour into daily pay, plus weekly, biweekly, monthly and yearly gross estimates.`,
        alternates: { canonical },
      };
    case "salary":
      return {
        title: `What salary is $${rate} an hour?`,
        description: `Convert $${rate}/hour into yearly salary (gross), plus monthly, biweekly, weekly and daily estimates.`,
        alternates: { canonical },
      };
    case "yearly":
    default:
      return {
        title: `How much is $${rate} an hour per year?`,
        description: `Convert $${rate}/hour into yearly pay (gross), plus monthly, biweekly, weekly and daily estimates.`,
        alternates: { canonical },
      };
  }
}
