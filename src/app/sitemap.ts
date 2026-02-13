import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const urls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
  ];

  for (let rate = 10; rate <= 300; rate++) {
    // Página original (gross)
    urls.push({
      url: `${baseUrl}/how-much-is-${rate}-an-hour`,
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Salary (yearly alternativa SEO) (gross)
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-salary`,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // Monthly (gross)
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-per-month`,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // Biweekly (gross)
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-biweekly`,
      changeFrequency: "monthly",
      priority: 0.6,
    });

    // Weekly (gross)
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-weekly`,
      changeFrequency: "monthly",
      priority: 0.6,
    });

    // Daily (gross)
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-daily`,
      changeFrequency: "monthly",
      priority: 0.5,
    });

    // =========================
    // AFTER-TAX variants
    // =========================

    // Base after-tax page
    urls.push({
      url: `${baseUrl}/after-tax/${rate}-an-hour`,
      changeFrequency: "monthly",
      priority: 0.6,
    });

    // Salary (yearly alternativa SEO) after-tax
    urls.push({
      url: `${baseUrl}/after-tax/${rate}-an-hour-salary`,
      changeFrequency: "monthly",
      priority: 0.55,
    });

    // Monthly after-tax
    urls.push({
      url: `${baseUrl}/after-tax/${rate}-an-hour-per-month`,
      changeFrequency: "monthly",
      priority: 0.55,
    });

    // Biweekly after-tax
    urls.push({
      url: `${baseUrl}/after-tax/${rate}-an-hour-biweekly`,
      changeFrequency: "monthly",
      priority: 0.5,
    });

    // Weekly after-tax
    urls.push({
      url: `${baseUrl}/after-tax/${rate}-an-hour-weekly`,
      changeFrequency: "monthly",
      priority: 0.5,
    });

    // Daily after-tax
    urls.push({
      url: `${baseUrl}/after-tax/${rate}-an-hour-daily`,
      changeFrequency: "monthly",
      priority: 0.45,
    });
  }

  return urls;
}
