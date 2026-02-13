"use client";

import { useMemo, useState } from "react";
import { calcFromHourly, formatMoney } from "@/lib/calc";

export default function Home() {
  const [hourlyRate, setHourlyRate] = useState(20);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const result = useMemo(() => {
    return calcFromHourly({ hourlyRate, hoursPerWeek, weeksPerYear });
  }, [hourlyRate, hoursPerWeek, weeksPerYear]);

  const popularRates = Array.from({ length: 91 }, (_, i) => i + 10);

  return (
    <>
      <section className="hero card">
        <h1>Hourly to Salary Calculator</h1>
        <p>
          Convert an hourly wage into <b>daily</b>, <b>weekly</b>, <b>biweekly</b>, <b>monthly</b>, and <b>yearly</b> gross pay.
          Adjust hours and weeks to match part-time, full-time or contract work.
        </p>
      </section>

      <section className="grid">
        <section className="form card">
          <h2 style={{ margin: 0, fontSize: 18 }}>Inputs</h2>
          <p className="small" style={{ marginTop: 6 }}>
            Tip: Most full-time jobs use 40 hours/week and 52 weeks/year.
          </p>

          <div className="row" style={{ marginTop: 14 }}>
            <div>
              <label>Hourly rate (USD)</label>
              <input
                className="input"
                type="number"
                value={hourlyRate}
                min={0}
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
                min={1}
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
                min={1}
                step={1}
                onChange={(e) => setWeeksPerYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="section card" style={{ marginTop: 14, padding: 14 }}>
            <div className="small">
              This calculator shows <b>gross</b> income (before taxes). Taxes vary by country/state and deductions.
            </div>
          </div>
        </section>

        <aside className="results card">
          <h2>Results</h2>

          <div className="kpis">
            <div className="kpi">
              <div className="label">Daily</div>
              <div className="value">{formatMoney(result.daily)}</div>
              <div className="hint">Based on 8 hours/day</div>
            </div>

            <div className="kpi">
              <div className="label">Weekly</div>
              <div className="value">{formatMoney(result.weekly)}</div>
              <div className="hint">Hourly × hours/week</div>
            </div>

            <div className="kpi">
              <div className="label">Biweekly</div>
              <div className="value">{formatMoney(result.biweekly)}</div>
              <div className="hint">Two-week estimate</div>
            </div>

            <div className="kpi">
              <div className="label">Monthly</div>
              <div className="value">{formatMoney(result.monthly)}</div>
              <div className="hint">Yearly ÷ 12</div>
            </div>

            <div className="kpi" style={{ gridColumn: "1 / -1", borderColor: "rgba(34,197,94,0.35)" }}>
              <div className="label">Yearly (gross)</div>
              <div className="value">{formatMoney(result.yearly)}</div>
              <div className="hint">Hourly × hours/week × weeks/year</div>
            </div>
          </div>
        </aside>
      </section>

      <section className="section card">
        <h2>How it works</h2>
        <p>
          Enter your hourly wage, hours per week, and weeks per year. We’ll instantly estimate your gross salary
          across common timeframes.
        </p>

        <h2 style={{ marginTop: 16 }}>Browse popular hourly rates</h2>
        <p>Open a dedicated page for each hourly wage (10–100 USD) to share or bookmark.</p>

        <div className="linksGrid">
          {popularRates.map((rate) => (
            <a key={rate} className="linkCard" href={`/how-much-is-${rate}-an-hour`}>
              <b>${rate}/hour</b>
              <div className="small">See yearly breakdown →</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
