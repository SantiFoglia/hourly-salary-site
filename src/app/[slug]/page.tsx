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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const rate = parseRateFromSlug(slug);
  if (rate === null) notFound();

  const r = calcFromHourly({ hourlyRate: rate, hoursPerWeek: 40, weeksPerYear: 52 });

  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h1>How much is ${rate}/hour per year?</h1>

      <p>
        If you make <b>${rate}/hour</b> and work 40 hours per week for 52 weeks, your gross yearly pay is{" "}
        <b>{formatMoney(r.yearly)}</b>.
      </p>

      <h2>Breakdown</h2>
      <ul style={{ lineHeight: 1.9 }}>
        <li><b>Daily:</b> {formatMoney(r.daily)}</li>
        <li><b>Weekly:</b> {formatMoney(r.weekly)}</li>
        <li><b>Biweekly:</b> {formatMoney(r.biweekly)}</li>
        <li><b>Monthly:</b> {formatMoney(r.monthly)}</li>
        <li><b>Yearly:</b> {formatMoney(r.yearly)}</li>
      </ul>

      <p style={{ marginTop: 24 }}>
        <a href="/">Back to calculator</a>
      </p>
    </main>
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
