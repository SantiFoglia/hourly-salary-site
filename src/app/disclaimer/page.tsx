import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | HourlySalaryCalculator",
  description: "Important disclaimers about the estimates shown on this website.",
};

export default function DisclaimerPage() {
  return (
    <main className="main">
      <div className="container">
        <section className="section card">
          <h1 style={{ marginTop: 0 }}>Disclaimer</h1>

          <p>
            HourlySalaryCalculator provides <b>informational estimates only</b>. Results shown on this website are
            based on user inputs and simple arithmetic and should not be considered financial, tax, legal, or
            accounting advice.
          </p>

          <h2 style={{ marginTop: 16 }}>Gross pay estimates</h2>
          <p>
            By default, results represent <b>gross</b> (pre-tax) earnings. Your net take-home pay can vary
            significantly depending on taxes, deductions, benefits, overtime rules, bonuses, and local regulations.
          </p>

          <h2 style={{ marginTop: 16 }}>No guarantees</h2>
          <p>
            We do our best to keep the calculator accurate, but we make no warranties regarding completeness,
            reliability, or availability. You use this website at your own risk.
          </p>
        </section>
      </div>
    </main>
  );
}
