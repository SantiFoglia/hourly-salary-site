import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | HourlySalaryCalculator",
  description: "How to contact the site owner.",
};

export default function ContactPage() {
  return (
    <section className="section card">
      <h1 style={{ marginTop: 0 }}>Contact</h1>

      <p>If you have questions, feedback, or correction requests, email:</p>

      <p style={{ fontSize: 18 }}>
        <a href="mailto:hourlysalaryhelp@gmail.com">hourlysalaryhelp@gmail.com</a>
      </p>

      <p style={{ marginTop: 16 }}>
        Please include the page URL and the hourly rate you were checking, if relevant.
      </p>
    </section>
  );
}
