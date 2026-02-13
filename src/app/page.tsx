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

  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h1>HourlySalaryCalculator</h1>
        <p>
          Free tool to convert your hourly wage into annual, monthly, weekly and daily income estimates.
       </p>
       
      <section style={{ marginTop: 20 }}>
  <h2>How it works</h2>
  <p>
    Simply enter your hourly wage, number of hours worked per week, and weeks worked per year.
    Our calculator will instantly estimate your gross yearly, monthly, biweekly and daily income.
  </p>

  <h2>Who is this calculator for?</h2>
  <p>
    This tool is ideal for employees, freelancers, contractors, and job seekers who want to
    understand how much an hourly rate translates into yearly salary.
  </p>
</section>


      <section style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <label>
          Hourly rate (USD):
          <input
            type="number"
            value={hourlyRate}
            min={0}
            step={0.5}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Hours per week:
          <input
            type="number"
            value={hoursPerWeek}
            min={1}
            step={1}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Weeks per year:
          <input
            type="number"
            value={weeksPerYear}
            min={1}
            step={1}
            onChange={(e) => setWeeksPerYear(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>
      </section>

      <hr style={{ margin: "22px 0" }} />

      <h2>Results</h2>
      <ul style={{ lineHeight: 1.9 }}>
        <li><b>Daily:</b> {formatMoney(result.daily)}</li>
        <li><b>Weekly:</b> {formatMoney(result.weekly)}</li>
        <li><b>Biweekly:</b> {formatMoney(result.biweekly)}</li>
        <li><b>Monthly:</b> {formatMoney(result.monthly)}</li>
        <li><b>Yearly (gross):</b> {formatMoney(result.yearly)}</li>
      </ul>

      <hr style={{ margin: "22px 0" }} />

      <hr style={{ margin: "22px 0" }} />

      <h2>Browse hourly rates</h2>
      <p>Quick links for common hourly wages (10–100 USD).</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
        {Array.from({ length: 91 }, (_, i) => i + 10).map((rate) => (
          <a
            key={rate}
            href={`/how-much-is-${rate}-an-hour`}
            style={{
              display: "block",
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            ${rate}/hour → yearly
          </a>
        ))}
      </div>
    </main>
  );
}
