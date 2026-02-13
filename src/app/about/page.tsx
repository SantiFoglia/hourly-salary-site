import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | HourlySalaryCalculator",
  description: "Learn what HourlySalaryCalculator does and how the estimates are calculated.",
};

export default function AboutPage() {
  return (
    <section className="section card">
      <h1 style={{ marginTop: 0 }}>About HourlySalaryCalculator</h1>

      <p>
        HourlySalaryCalculator is a free tool that helps you convert an hourly wage into estimated{" "}
        <b>daily</b>, <b>weekly</b>, <b>biweekly</b>, <b>monthly</b>, and <b>yearly</b> income.
      </p>

      <h2 style={{ marginTop: 16 }}>How the estimates work</h2>
      <p>
        Results are calculated using the hourly rate you enter, multiplied by your hours per week and
        weeks per year. Monthly results are estimated as yearly / 12.
      </p>

      <h2 style={{ marginTop: 16 }}>Important note</h2>
      <p>
        All values shown are <b>gross estimates</b> (before taxes, benefits, and deductions). Actual take-home
        pay depends on your location and employer/contract terms.
      </p>
    </section>
  );
}
