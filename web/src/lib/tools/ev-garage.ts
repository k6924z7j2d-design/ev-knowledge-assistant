import { z } from "zod";
import { tool } from "ai";
import { evVehicles, getEvBySlug } from "@/lib/ev-data";

export const evGarageTool = tool({
  description:
    "Search the user's EV garage (the shortlisted vehicles being compared in this app) by name or trim, or look up one vehicle by its slug. Returns spec, pricing, range, charging, and reliability data for matching vehicles.",
  inputSchema: z.object({
    query: z.string().optional().describe("Case-insensitive text to match against vehicle name or trim"),
    slug: z.string().optional().describe("Exact vehicle slug to look up, e.g. 'voltra'"),
  }),
  execute: async ({ query, slug }) => {
    if (slug) {
      const vehicle = getEvBySlug(slug);
      return vehicle ? [vehicle] : [];
    }
    if (!query) return evVehicles;
    const needle = query.toLowerCase();
    return evVehicles.filter(
      (v) => v.name.toLowerCase().includes(needle) || v.trim.toLowerCase().includes(needle),
    );
  },
});
