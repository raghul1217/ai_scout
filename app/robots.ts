import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://aiscout.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/news/", "/tools/", "/learn/", "/community", "/about", "/pricing", "/contact", "/privacy", "/terms"],
        disallow: ["/admin/", "/account", "/payment/", "/premium", "/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
