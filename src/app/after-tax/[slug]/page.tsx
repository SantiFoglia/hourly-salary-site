import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { calcFromHourly, formatMoney } from "@/lib/calc";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type AfterTaxKind = "yearly" | "monthly" | "weekly" | "biweekly" | "daily";

function parseSlug(slug: string): { rate: number; kind: AfterTaxKind } | null {
  // Allowed:
  // - 20-an-hour
  // - 20-an-hour-per-month
  // - 20-an-hour-per-year
  // - 20-an-hour-weekly
  // - 20-an-hour-biweekly
  // - 20-an-hour-daily
  const m = slug.match(
    /^(\d+(?:\.\d+)?)\-an\-hour(?:\-(per\-year|per\-month|weekly|biweekly|daily))?$/
  );
  if (!m) return null;

  const rate = Number(m[1]);
  if (!Number.isFinite(rate) || rate <= 0 || rate > 500) return null;

  const tail = m[2];
  const kind: AfterTaxKind =
    tail === "per-month"
      ? "monthly"
      : tail === "per-year"
      ? "yearly"
      : tail === "weekly"
      ? "weekly"
      : tail === "biweekly"
      ? "biweekly"
      : tail === "daily"
      ? "daily"
      : "yearly";

  return { rate, kind };
}

function labelFor(kind: AfterTaxKind) {
  switch (kind) {
    case "daily":
      return "per day";
    case "weekly":
      return "per week";
    case "biweekly":
      return "every 2 weeks";
    case "monthly":
      return "per month";
    case "yearly":
      return "per year";
  }
}

function kindLabel(kind: AfterTaxKind) {
  switch (kind) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "biweekly":
      return "Biweekly";
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Yearly";
  }
}

function pickValue(kind: AfterTaxKind, r: ReturnType<typeof calcFromHourly>) {
  switch (kind) {
    case "daily":
      return r.daily;
    case "weekly":
      return r.weekly;
    case "biweekly":
      return r.biweekly;
    case "monthly":
      return r.monthly;
    case "yearly":
      return r.yearly;
  }
}

function grossSlugsForRate(rate: number) {
  return {
    yearly: `how-much-is-${rate}-an-hour`,
    salary: `${rate}-an-hour-salary`,
    monthly: `${rate}-an-hour-per-month`,
    biweekly: `${rate}-an-hour-biweekly`,
    weekly: `${rate}-an-hour-weekly`,
    daily: `${rate}-an-hour-daily`,
  };
}

/** ✅ After-tax slugs for the same rate (for the local "More pages" section) */
function afterTaxSlugsForRate(rate: number) {
  return {
    yearly: `after-tax/${rate}-an-hour`,
    monthly: `after-tax/${rate}-an-hour-per-month`,
    weekly: `after-tax/${rate}-an-hour-weekly`,
    biweekly: `after-tax/${rate}-an-hour-biweekly`,
    daily: `after-tax/${rate}-an-hour-daily`,
  };
}

function buildFaq(rate: number, kind: AfterTaxKind) {
  const r = calcFromHourly({ hourlyRate: rate, hoursPerWeek: 40, weeksPerYear: 52 });

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

  const netFocus = focus * (1 - EFFECTIVE_TAX_RATE);

  return [
    {
      q: `How much is $${rate}/hour after tax ${focusLabel}?`,
      a: `Using an example effective tax rate of about ${Math.round(
        EFFECTIVE_TAX_RATE * 100
      )}%, $${rate}/hour is about ${formatMoney(netFocus)} ${focusLabel} (estimated take-home), assuming 40 hours/week and 52 weeks/year.`,
    },
    {
      q: "Is this accurate?",
      a: "It’s an estimate. Real take-home pay depends on your location, filing status, deductions, benefits, overtime, and local taxes.",
    },
    {
      q: "Does this include state taxes?",
      a: "Not specifically. This uses a simple effective tax rate placeholder. We may add state/country-specific estimates later.",
    },
    {
      q: "Can I change the tax rate?",
      a: "Not yet. Right now the site uses a fixed effective tax estimate to keep the pages simple and consistent.",
    },
    {
      q: "Can I change hours per week or weeks per year?",
      a: "These pages use standard assumptions (40h/week, 52 weeks). Use the home calculator for custom gross inputs.",
    },
  ];
}

function faqJsonLd(rate: number, kind: AfterTaxKind) {
  const faqs = buildFaq(rate, kind);

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

function breadcrumbJsonLd(baseUrl: string, rate: number, slug: string) {
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
        name: "After tax",
        item: `${baseUrl}/after-tax/${slug}`,
      },
    ],
  };
}

// Super simple placeholder model (we'll improve later)
const EFFECTIVE_TAX_RATE = 0.1965;
const SITE_URL = "https://hourly-salary-site.vercel.app";

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const { rate, kind } = parsed;

  const hoursPerWeek = 40;
  const weeksPerYear = 52;

  const gross = calcFromHourly({ hourlyRate: rate, hoursPerWeek, weeksPerYear });
  const grossMain = pickValue(kind, gross);
  const netMain = grossMain * (1 - EFFECTIVE_TAX_RATE);

  const netAll = {
    daily: gross.daily * (1 - EFFECTIVE_TAX_RATE),
    weekly: gross.weekly * (1 - EFFECTIVE_TAX_RATE),
    biweekly: gross.biweekly * (1 - EFFECTIVE_TAX_RATE),
    monthly: gross.monthly * (1 - EFFECTIVE_TAX_RATE),
    yearly: gross.yearly * (1 - EFFECTIVE_TAX_RATE),
  };

  const titleKind =
    kind === "yearly"
      ? "per year"
      : kind === "monthly"
      ? "per month"
      : kind === "weekly"
      ? "per week"
      : kind === "biweekly"
      ? "biweekly"
      : "per day";

  const grossLinks = grossSlugsForRate(rate);
  const afterTaxLinks = afterTaxSlugsForRate(rate);

  return (
    <section className="section card">
      {/* ✅ JSON-LD: FAQ + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(rate, kind)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(SITE_URL, rate, slug)),
        }}
      />

      {/* Breadcrumb visible */}
      <nav className="small" aria-label="Breadcrumb" style={{ marginBottom: 10 }}>
        <Link href="/" style={{ opacity: 0.9 }}>
          Home
        </Link>
        <span style={{ opacity: 0.6 }}> / </span>
        <Link href={`/${grossLinks.yearly}`} style={{ opacity: 0.9 }}>
          ${rate}/hour
        </Link>
        <span style={{ opacity: 0.6 }}> / </span>
        <span style={{ opacity: 0.9 }}>After tax</span>
      </nav>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div className="small" style={{ opacity: 0.95 }}>
          <span className="badge" style={{ background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.35)" }}>
            After-tax estimate
          </span>{" "}
          <span style={{ opacity: 0.7 }}>·</span>{" "}
          <span style={{ opacity: 0.85 }}>{kindLabel(kind)}</span>
        </div>
        <span className="badge">Estimate</span>
      </div>

      <h1 style={{ marginTop: 10 }}>{`$${rate}/hour after tax ${titleKind}?`}</h1>

      <p>
        With a simple estimated tax rate of <b>{Math.round(EFFECTIVE_TAX_RATE * 100)}%</b>, if you make{" "}
        <b>${rate}/hour</b> and work <b>{hoursPerWeek} hours/week</b> for <b>{weeksPerYear} weeks</b>, your
        estimated take-home pay {labelFor(kind)} is <b>{formatMoney(netMain)}</b>.
      </p>

      <div className="kpis" style={{ marginTop: 14 }}>
        <div className="kpi">
          <div className="label">Gross {labelFor(kind)}</div>
          <div className="value">{formatMoney(grossMain)}</div>
          <div className="hint">Before taxes</div>
        </div>
        <div className="kpi">
          <div className="label">Estimated take-home {labelFor(kind)}</div>
          <div className="value">{formatMoney(netMain)}</div>
          <div className="hint">Using ~{Math.round(EFFECTIVE_TAX_RATE * 100)}% effective tax</div>
        </div>
      </div>

      <h2 style={{ marginTop: 18 }}>Breakdown (estimated net)</h2>
      <div className="kpis" style={{ marginTop: 10 }}>
        <div className="kpi">
          <div className="label">Daily</div>
          <div className="value">{formatMoney(netAll.daily)}</div>
          <div className="hint">Assumes 8 hours/day</div>
        </div>
        <div className="kpi">
          <div className="label">Weekly</div>
          <div className="value">{formatMoney(netAll.weekly)}</div>
          <div className="hint">{hoursPerWeek} hours/week</div>
        </div>
        <div className="kpi">
          <div className="label">Biweekly</div>
          <div className="value">{formatMoney(netAll.biweekly)}</div>
          <div className="hint">2× weekly</div>
        </div>
        <div className="kpi">
          <div className="label">Monthly</div>
          <div className="value">{formatMoney(netAll.monthly)}</div>
          <div className="hint">Yearly ÷ 12</div>
        </div>
        <div className="kpi" style={{ gridColumn: "1 / -1" }}>
          <div className="label">Yearly</div>
          <div className="value">{formatMoney(netAll.yearly)}</div>
          <div className="hint">{weeksPerYear} weeks/year</div>
        </div>
      </div>

      <h2 style={{ marginTop: 18 }}>More pages for ${rate}/hour</h2>

      <div className="linksGrid">
        <Link className="linkCard" href={`/${grossLinks.yearly}`}>
          <b>Gross yearly page</b>
          <div className="small">{grossLinks.yearly}</div>
        </Link>

        <Link className="linkCard" href={`/${afterTaxLinks.yearly}`}>
          <b>After tax (yearly)</b>
          <div className="small">{afterTaxLinks.yearly}</div>
        </Link>

        <Link className="linkCard" href={`/${afterTaxLinks.monthly}`}>
          <b>After tax (monthly)</b>
          <div className="small">{afterTaxLinks.monthly}</div>
        </Link>

        <Link className="linkCard" href={`/${afterTaxLinks.weekly}`}>
          <b>After tax (weekly)</b>
          <div className="small">{afterTaxLinks.weekly}</div>
        </Link>

        <Link className="linkCard" href={`/${afterTaxLinks.biweekly}`}>
          <b>After tax (biweekly)</b>
          <div className="small">{afterTaxLinks.biweekly}</div>
        </Link>

        <Link className="linkCard" href={`/${afterTaxLinks.daily}`}>
          <b>After tax (daily)</b>
          <div className="small">{afterTaxLinks.daily}</div>
        </Link>
      </div>

      <h2 style={{ marginTop: 18 }}>Compare with gross pay</h2>
      <div className="linksGrid">
        <Link className="linkCard" href={`/${grossLinks.yearly}`}>
          <b>Gross yearly</b>
          <div className="small">{grossLinks.yearly}</div>
        </Link>

        <Link className="linkCard" href={`/${grossLinks.salary}`}>
          <b>Gross salary (yearly)</b>
          <div className="small">{grossLinks.salary}</div>
        </Link>

        <Link className="linkCard" href={`/${grossLinks.monthly}`}>
          <b>Gross monthly</b>
          <div className="small">{grossLinks.monthly}</div>
        </Link>

        <Link className="linkCard" href={`/${grossLinks.weekly}`}>
          <b>Gross weekly</b>
          <div className="small">{grossLinks.weekly}</div>
        </Link>

        <Link className="linkCard" href={`/${grossLinks.biweekly}`}>
          <b>Gross biweekly</b>
          <div className="small">{grossLinks.biweekly}</div>
        </Link>

        <Link className="linkCard" href={`/${grossLinks.daily}`}>
          <b>Gross daily</b>
          <div className="small">{grossLinks.daily}</div>
        </Link>
      </div>

      <h2 style={{ marginTop: 18 }}>FAQ</h2>
      <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
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

      <p className="small" style={{ marginTop: 14 }}>
        Note: this page uses a simplified effective tax rate for an estimate. Real take-home pay varies widely.
      </p>
    </section>
  );
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let rate = 10; rate <= 300; rate++) {
    params.push({ slug: `${rate}-an-hour` });
    params.push({ slug: `${rate}-an-hour-per-month` });
    params.push({ slug: `${rate}-an-hour-per-year` });
    params.push({ slug: `${rate}-an-hour-weekly` });
    params.push({ slug: `${rate}-an-hour-biweekly` });
    params.push({ slug: `${rate}-an-hour-daily` });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};

  const { rate, kind } = parsed;

  const suffix =
    kind === "yearly"
      ? "per year"
      : kind === "monthly"
      ? "per month"
      : kind === "weekly"
      ? "per week"
      : kind === "biweekly"
      ? "biweekly"
      : "per day";

  const canonical = `${SITE_URL}/after-tax/${slug}`;

  return {
    title: `$${rate}/hour after tax ${suffix} | HourlySalaryCalculator`,
    description: `Estimate take-home pay for $${rate}/hour after taxes. Includes daily, weekly, biweekly, monthly and yearly net estimates.`,
    alternates: { canonical },
  };
}
