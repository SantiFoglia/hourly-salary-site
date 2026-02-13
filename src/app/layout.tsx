import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HourlySalaryCalculator – Convert Hourly Wage to Yearly Income",
    template: "%s | HourlySalaryCalculator",
  },
  description:
    "Free online hourly to salary calculator. Instantly convert hourly pay into daily, weekly, monthly and yearly income.",
  metadataBase: new URL("https://hourlysalarycalculator.com"),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="xMJNiEBNOkbVeQfdZhYaUh9rTdAx5U8cQHp2euqAx90" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        <main style={{ minHeight: "80vh" }}>
          {children}
        </main>

        <footer
          style={{
            marginTop: "60px",
            padding: "20px",
            borderTop: "1px solid #ddd",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          <a href="/about">About</a> |{" "}
          <a href="/privacy-policy">Privacy Policy</a> |{" "}
          <a href="/terms-of-service">Terms of Service</a> |{" "}
          <a href="/disclaimer">Disclaimer</a> |{" "}
          <a href="/contact">Contact</a>
        </footer>

      </body>
    </html>
  );
}
