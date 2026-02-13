import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HourlySalaryCalculator",
  description: "Convert hourly wage to yearly, monthly, weekly and daily pay (gross).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <nav className="nav">
              <div className="brand">
                <Link href="/">HourlySalaryCalculator</Link>
                <span className="badge">Free</span>
              </div>

              <div className="navlinks">
                <Link href="/">Calculator</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy-policy">Privacy</Link>
                <Link href="/terms-of-service">Terms</Link>
                <Link href="/disclaimer">Disclaimer</Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="main">
          <div className="container">{children}</div>
        </main>

        <footer className="footer">
          <div className="container">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
              <div>© {year} HourlySalaryCalculator</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/about">About</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms-of-service">Terms</Link>
                <Link href="/disclaimer">Disclaimer</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              This site provides general estimates. Results may vary by location, taxes, and benefits.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
