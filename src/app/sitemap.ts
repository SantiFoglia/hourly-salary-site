import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";


  const urls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
  ];

  for (let rate = 10; rate <= 100; rate++) {
    urls.push({
      url: `${baseUrl}/how-much-is-${rate}-an-hour`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return urls;
}
