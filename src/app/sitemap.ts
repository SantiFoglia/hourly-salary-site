import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const urls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
  ];

  for (let rate = 10; rate <= 300; rate++) {
    // Página original
    urls.push({
      url: `${baseUrl}/how-much-is-${rate}-an-hour`,
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Salary (yearly alternativa SEO)
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-salary`,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // Monthly
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-per-month`,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // Biweekly
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-biweekly`,
      changeFrequency: "monthly",
      priority: 0.6,
    });

    // Weekly
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-weekly`,
      changeFrequency: "monthly",
      priority: 0.6,
    });

    // Daily
    urls.push({
      url: `${baseUrl}/${rate}-an-hour-daily`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return urls;
}
