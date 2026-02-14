import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "HourlySalaryCalculator",
  description:
    "Free tool to convert your hourly wage into yearly, monthly, biweekly, weekly and daily gross income estimates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2149771442856256"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        {/* Header */}
        <header className="header">
          <div className="container">
            <nav className="nav">
              <div className="brand">
                <Link href="/" aria-label="HourlySalaryCalculator home">
                  HourlySalaryCalculator
                </Link>
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

        {/* Main */}
        <main className="main">
          <div className="container">{children}</div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <span>© {new Date().getFullYear()} HourlySalaryCalculator</span>
            <span style={{ opacity: 0.6 }}>•</span>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
