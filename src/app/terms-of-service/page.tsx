import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | HourlySalaryCalculator",
  description: "Terms of Service for using HourlySalaryCalculator.",
};

export default function TermsPage() {
  return (
    <main className="main">
      <div className="container">
        <section className="section card">
          <h1 style={{ marginTop: 0 }}>Terms of Service</h1>

          <p>
            By accessing or using HourlySalaryCalculator, you agree to these Terms of Service. If you do not agree,
            please do not use the website.
          </p>

          <h2 style={{ marginTop: 16 }}>Use of the website</h2>
          <p>
            You may use the calculator for personal or informational purposes. You agree not to misuse the website,
            attempt to disrupt it, or use it for unlawful activities.
          </p>

          <h2 style={{ marginTop: 16 }}>No professional advice</h2>
          <p>
            The website provides estimates only and does not provide financial, tax, legal, or accounting advice.
          </p>

          <h2 style={{ marginTop: 16 }}>Third-party services</h2>
          <p>
            This website may display third-party advertising and use third-party services (for example, analytics
            or advertising platforms). These services may collect data as described in our Privacy Policy.
          </p>

          <h2 style={{ marginTop: 16 }}>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, HourlySalaryCalculator is not liable for any damages arising
            from your use of the website or reliance on the estimates provided.
          </p>

          <h2 style={{ marginTop: 16 }}>Changes</h2>
          <p>
            We may update these Terms from time to time. Continued use of the website means you accept the updated
            Terms.
          </p>
        </section>
      </div>
    </main>
  );
}
