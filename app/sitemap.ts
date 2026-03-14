import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{ url: APP_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
		{
			url: `${APP_URL}/pricing`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${APP_URL}/changelog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{ url: `${APP_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
		{
			url: `${APP_URL}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];
}
