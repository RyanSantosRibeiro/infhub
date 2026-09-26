import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; return ["", "/guia-obs"].map(path=>({url:`${base}${path}`,changeFrequency:"monthly",priority:path?0.6:1})); }
