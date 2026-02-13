import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | HourlySalaryCalculator",
  description: "Privacy Policy explaining how data and cookies may be used on this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="main">
      <div className="container">
        <section className="section card">
          <h1 style={{ marginTop: 0 }}>Privacy Policy</h1>

          <p>
            This Privacy Policy explains how HourlySalaryCalculator may collect and use information when you visit
            the website.
          </p>

          <h2 style={{ marginTop: 16 }}>Information we collect</h2>
          <ul style={{ lineHeight: 1.9 }}>
            <li>
              <b>Non-personal data:</b> basic usage data (such as pages viewed, device/browser information) may be
              collected by analytics or advertising providers.
            </li>
            <li>
              <b>User inputs:</b> values you type into the calculator are used to compute results. We do not ask
              you to create an account.
            </li>
          </ul>

          <h2 style={{ marginTop: 16 }}>Cookies and advertising</h2>
          <p>
            We may display advertising from third-party partners. These partners may use cookies or similar
            technologies to serve ads, measure ad performance, and personalize advertising depending on your
            settings and region.
          </p>

          <h2 style={{ marginTop: 16 }}>Third-party links</h2>
          <p>
            The website may contain links to third-party websites. We are not responsible for their privacy
            practices.
          </p>

          <h2 style={{ marginTop: 16 }}>Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please reach out via the{" "}
            <Link href="/contact">Contact</Link> page.
          </p>

          <h2 style={{ marginTop: 16 }}>Updates</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
