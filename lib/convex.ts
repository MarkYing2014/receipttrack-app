import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Create a Convex client instance for server-side usage
export const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export { api };
