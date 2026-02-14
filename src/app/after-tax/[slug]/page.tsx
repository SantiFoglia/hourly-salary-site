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

/** ✅ NUEVO: slugs de las páginas GROSS para el mismo rate */
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

// Super simple placeholder model (we'll improve later)
// Example effective tax rate: 19.65% (12% + 7.65%)
const EFFECTIVE_TAX_RATE = 0.1965;

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const { rate, kind } = parsed;

  // Assumptions for base gross calculations
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

  return (
    <section className="section card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div className="small">
          <Link href="/">Home</Link> <span style={{ opacity: 0.6 }}> / </span>
          <Link href={`/${grossLinks.yearly}`}>${rate}/hour</Link>{" "}
          <span style={{ opacity: 0.6 }}> / </span>
          <span>After tax</span>
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

      {/* ✅ Ya tenías el cluster after-tax */}
      <div className="linksGrid">
        <Link className="linkCard" href={`/${grossLinks.yearly}`}>
          <b>Gross yearly page</b>
          <div className="small">{grossLinks.yearly}</div>
        </Link>

        <Link className="linkCard" href={`/after-tax/${rate}-an-hour`}>
          <b>After tax (yearly)</b>
          <div className="small">after-tax/{rate}-an-hour</div>
        </Link>
        <Link className="linkCard" href={`/after-tax/${rate}-an-hour-per-month`}>
          <b>After tax (monthly)</b>
          <div className="small">after-tax/{rate}-an-hour-per-month</div>
        </Link>
        <Link className="linkCard" href={`/after-tax/${rate}-an-hour-weekly`}>
          <b>After tax (weekly)</b>
          <div className="small">after-tax/{rate}-an-hour-weekly</div>
        </Link>
        <Link className="linkCard" href={`/after-tax/${rate}-an-hour-biweekly`}>
          <b>After tax (biweekly)</b>
          <div className="small">after-tax/{rate}-an-hour-biweekly</div>
        </Link>
        <Link className="linkCard" href={`/after-tax/${rate}-an-hour-daily`}>
          <b>After tax (daily)</b>
          <div className="small">after-tax/{rate}-an-hour-daily</div>
        </Link>
      </div>

      {/* ✅ NUEVO: cluster GROSS completo (ida y vuelta) */}
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
      <div className="kpi" style={{ marginTop: 10 }}>
        <div className="label">
          <b>Is this accurate?</b>
        </div>
        <div className="hint" style={{ marginTop: 8 }}>
          It’s an estimate. Real take-home pay depends on your location, filing status, deductions, benefits,
          overtime, and local taxes. We’ll add a more detailed calculator later.
        </div>
      </div>

      <div className="kpi" style={{ marginTop: 10 }}>
        <div className="label">
          <b>Can I change hours per week?</b>
        </div>
        <div className="hint" style={{ marginTop: 8 }}>
          Use the main calculator on the home page to adjust hours/weeks, then we’ll expand after-tax pages to
          support custom inputs.
        </div>
      </div>
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

  return {
    title: `$${rate}/hour after tax ${suffix} | HourlySalaryCalculator`,
    description: `Estimate take-home pay for $${rate}/hour after taxes. Includes daily, weekly, biweekly, monthly and yearly net estimates.`,
  };
}
