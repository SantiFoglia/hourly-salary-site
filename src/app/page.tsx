"use client";

import { useMemo, useState } from "react";
import { calcFromHourly, formatMoney } from "@/lib/calc";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildPopularRates() {
  // Mix de “comunes” + rango 10..100
  const common = [10, 12, 15, 18, 20, 22, 25, 27, 30, 35, 40, 45, 50, 60, 75, 100];
  const range = Array.from({ length: 91 }, (_, i) => i + 10); // 10..100
  const all = Array.from(new Set([...common, ...range]));
  return all;
}

function buildExamples(rate: number) {
  const presets = [
    { label: "Full-time (40h/week, 52 weeks)", hours: 40, weeks: 52 },
    { label: "Full-time (40h/week, 50 weeks)", hours: 40, weeks: 50 },
    { label: "Part-time (20h/week, 52 weeks)", hours: 20, weeks: 52 },
    { label: "Part-time (30h/week, 52 weeks)", hours: 30, weeks: 52 },
    { label: "Contractor style (40h/week, 48 weeks)", hours: 40, weeks: 48 },
  ];

  return presets.map((p) => {
    const r = calcFromHourly({ hourlyRate: rate, hoursPerWeek: p.hours, weeksPerYear: p.weeks });
    return { ...p, yearly: r.yearly, monthly: r.monthly, weekly: r.weekly };
  });
}

export default function Home() {
  const [hourlyRate, setHourlyRate] = useState(20);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const safeRate = clamp(Number(hourlyRate) || 0, 0, 500);
  const safeHours = clamp(Number(hoursPerWeek) || 0, 0, 168);
  const safeWeeks = clamp(Number(weeksPerYear) || 0, 0, 54);

  const result = useMemo(() => {
    return calcFromHourly({
      hourlyRate: safeRate,
      hoursPerWeek: safeHours || 0,
      weeksPerYear: safeWeeks || 0,
    });
  }, [safeRate, safeHours, safeWeeks]);

  const examples = useMemo(() => buildExamples(clamp(safeRate || 20, 1, 500)), [safeRate]);

  const popularRates = useMemo(() => buildPopularRates(), []);

  return (
    <main className="container main">
      {/* HERO */}
      <section className="hero card">
        <h1>HourlySalaryCalculator</h1>
        <p>
          Free tool to convert your hourly wage into <b>yearly</b>, <b>monthly</b>, <b>biweekly</b>,{" "}
          <b>weekly</b> and <b>daily</b> gross income estimates.
        </p>
        <p className="small" style={{ marginTop: 10 }}>
          Quick salary math for employees, freelancers, contractors and job seekers.
        </p>
      </section>

      {/* GRID: Form + Results */}
      <div className="grid">
        <section className="form card">
          <h2 style={{ marginTop: 0 }}>Calculator</h2>

          <div className="row" style={{ marginTop: 12 }}>
            <div>
              <label>Hourly rate (USD)</label>
              <input
                className="input"
                type="number"
                value={hourlyRate}
                min={0}
                max={500}
                step={0.5}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Hours per week</label>
              <input
                className="input"
                type="number"
                value={hoursPerWeek}
                min={0}
                max={168}
                step={1}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Weeks per year</label>
              <input
                className="input"
                type="number"
                value={weeksPerYear}
                min={0}
                max={54}
                step={1}
                onChange={(e) => setWeeksPerYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="section" style={{ marginTop: 14, padding: 0, background: "transparent", border: "none" }}>
            <p className="small">
              Tip: 52 weeks is a simple assumption, but many people work 48–50 weeks after vacations/holidays.
            </p>
          </div>
        </section>

        <section className="results card">
          <h2>Results (gross)</h2>

          <div className="kpis">
            <div className="kpi">
              <div className="label">Daily</div>
              <div className="value">{formatMoney(result.daily)}</div>
              <div className="hint">Assumes 8-hour day</div>
            </div>

            <div className="kpi">
              <div className="label">Weekly</div>
              <div className="value">{formatMoney(result.weekly)}</div>
              <div className="hint">{safeHours || 0} hours/week</div>
            </div>

            <div className="kpi">
              <div className="label">Biweekly</div>
              <div className="value">{formatMoney(result.biweekly)}</div>
              <div className="hint">2× weekly estimate</div>
            </div>

            <div className="kpi">
              <div className="label">Monthly</div>
              <div className="value">{formatMoney(result.monthly)}</div>
              <div className="hint">Yearly ÷ 12</div>
            </div>

            <div className="kpi" style={{ gridColumn: "1 / -1" }}>
              <div className="label">Yearly</div>
              <div className="value">{formatMoney(result.yearly)}</div>
              <div className="hint">{safeWeeks || 0} weeks/year</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <a
              href={`/how-much-is-${clamp(Math.round(safeRate || 20), 1, 500)}-an-hour`}
              className="badge"
              style={{ display: "inline-block" }}
            >
              View the dedicated page for ${clamp(Math.round(safeRate || 20), 1, 500)}/hour →
            </a>
          </div>
        </section>
      </div>

      {/* How it works */}
      <section className="section card">
        <h2>How it works</h2>
        <p>
          The calculator uses a simple formula:
          <br />
          <b>Hourly rate × hours per week × weeks per year</b> = estimated yearly gross pay.
        </p>
        <p>
          It also breaks down your earnings into daily, weekly, biweekly and monthly estimates to make it easier
          to compare job offers and budgets.
        </p>

        <h2 style={{ marginTop: 16 }}>Gross vs net pay</h2>
        <p>
          These are <b>gross</b> estimates (before taxes). Your net take-home pay depends on taxes, benefits,
          overtime, deductions, and where you live.
        </p>
      </section>

      {/* Example scenarios */}
      <section className="section card">
        <h2>Example scenarios for ${clamp(Math.round(safeRate || 20), 1, 500)}/hour</h2>
        <p className="small">
          Quick comparisons for common work schedules.
        </p>

        <div className="linksGrid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {examples.map((ex) => (
            <div key={ex.label} className="linkCard">
              <div style={{ fontWeight: 800 }}>{ex.label}</div>
              <div className="small" style={{ marginTop: 6 }}>
                Yearly: <b>{formatMoney(ex.yearly)}</b>
              </div>
              <div className="small">
                Monthly: {formatMoney(ex.monthly)} · Weekly: {formatMoney(ex.weekly)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse rates */}
      <section className="section card">
        <h2>Browse popular hourly wages</h2>
        <p className="small">
          Explore dedicated pages with breakdown, FAQ and related rates.
        </p>

        <div className="linksGrid">
          {popularRates.slice(0, 80).map((rate) => (
            <a key={rate} className="linkCard" href={`/how-much-is-${rate}-an-hour`}>
              How much is <b>${rate}/hour</b> per year?
              <div className="small" style={{ marginTop: 6 }}>Gross salary estimate</div>
            </a>
          ))}
        </div>

        <p className="small" style={{ marginTop: 12 }}>
          Looking for a rate outside 10–100? Edit the URL like{" "}
          <code style={{ color: "rgba(255,255,255,0.85)" }}>/how-much-is-37-an-hour</code>.
        </p>
      </section>

      {/* Mini FAQ */}
      <section className="section card">
        <h2>FAQ</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <div className="kpi">
            <div className="value" style={{ fontSize: 16 }}>Can I use this calculator outside the US?</div>
            <div className="hint" style={{ fontSize: 13, marginTop: 8, color: "var(--muted)" }}>
              Yes. The math is universal, but taxes and deductions vary by country. Use the gross estimate as a
              starting point.
            </div>
          </div>

          <div className="kpi">
            <div className="value" style={{ fontSize: 16 }}>Does this include overtime or bonuses?</div>
            <div className="hint" style={{ fontSize: 13, marginTop: 8, color: "var(--muted)" }}>
              No. This is a simple base estimate. Overtime and bonuses can change your actual pay.
            </div>
          </div>

          <div className="kpi">
            <div className="value" style={{ fontSize: 16 }}>Is biweekly always exactly 2× weekly?</div>
            <div className="hint" style={{ fontSize: 13, marginTop: 8, color: "var(--muted)" }}>
              In this estimate, yes. Real payroll depends on your employer’s pay schedule and calendar.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
