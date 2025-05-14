import { NextRequest } from "next/server";
import { serve } from "inngest/next";
import { inngest } from "@/inngest.config";
import { receiptHandlers } from "@/inngest/handlers";

// Configure CORS headers for cross-browser compatibility (especially Safari)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // 24 hours
};

// Combined Inngest serve handler with all functions
const handler = serve({
  client: inngest,
  functions: [...receiptHandlers],
  streaming: "allow",
});

// Handle OPTIONS requests (preflight) for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Handle POST requests
export async function POST(request: NextRequest) {
  const response = await handler(request);
  
  // Add CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}
