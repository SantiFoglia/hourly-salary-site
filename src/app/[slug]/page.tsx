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

  return (
    <main className="container main">
      <section className="section card">
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
          <Link className="linkCard" href={`/${links.yearly}`}>
            Yearly pay page
            <div className="small">how-much-is-{rate}-an-hour</div>
          </Link>

          <Link className="linkCard" href={`/${links.salary}`}>
            Salary (yearly) page
            <div className="small">{rate}-an-hour-salary</div>
          </Link>

          <Link className="linkCard" href={`/${links.monthly}`}>
            Monthly pay page
            <div className="small">{rate}-an-hour-per-month</div>
          </Link>

          <Link className="linkCard" href={`/${links.biweekly}`}>
            Biweekly pay page
            <div className="small">{rate}-an-hour-biweekly</div>
          </Link>

          <Link className="linkCard" href={`/${links.weekly}`}>
            Weekly pay page
            <div className="small">{rate}-an-hour-weekly</div>
          </Link>

          <Link className="linkCard" href={`/${links.daily}`}>
            Daily pay page
            <div className="small">{rate}-an-hour-daily</div>
          </Link>
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

  // Títulos/descr SEO por tipo
  switch (kind) {
    case "monthly":
      return {
        title: `How much is $${rate} an hour per month?`,
        description: `Convert $${rate}/hour into monthly pay, plus weekly, biweekly and yearly gross estimates.`,
      };
    case "biweekly":
      return {
        title: `How much is $${rate} an hour biweekly?`,
        description: `Convert $${rate}/hour into biweekly pay, plus daily, weekly, monthly and yearly gross estimates.`,
      };
    case "weekly":
      return {
        title: `How much is $${rate} an hour per week?`,
        description: `Convert $${rate}/hour into weekly pay, plus daily, biweekly, monthly and yearly gross estimates.`,
      };
    case "daily":
      return {
        title: `How much is $${rate} an hour per day?`,
        description: `Convert $${rate}/hour into daily pay, plus weekly, biweekly, monthly and yearly gross estimates.`,
      };
    case "salary":
      return {
        title: `What salary is $${rate} an hour?`,
        description: `Convert $${rate}/hour into yearly salary (gross), plus monthly, biweekly, weekly and daily estimates.`,
      };
    case "yearly":
    default:
      return {
        title: `How much is $${rate} an hour per year?`,
        description: `Convert $${rate}/hour into yearly pay (gross), plus monthly, biweekly, weekly and daily estimates.`,
      };
  }
}
