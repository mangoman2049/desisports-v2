import { MetadataRoute } from "next";

/**
 * Robots.txt Generator
 * 
 * Strict Anti-Scraping Policy:
 * 1. Blocks aggressive AI data miners and scraper bots (GPTBot, CCBot, Bytespider, ClaudeBot, etc.)
 *    to preserve server RAM, CPU, and zero-dollar hosting budgets on Render.
 * 2. Blocks all search engines and general crawlers from private and sensitive routes (/api/, /admin/, /prompts/).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "Bytespider",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "PerplexityBot",
          "FacebookBot",
          "Diffbot",
          "cohere-ai",
          "omgili",
          "ImagesiftBot",
          "Scrapy",
        ],
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/prompts/"],
      },
    ],
    sitemap: "https://desisports.milanchheda.com/sitemap.xml",
  };
}
