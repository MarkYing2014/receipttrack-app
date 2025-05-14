/**
 * Next.js App Router API route for Inngest
 * - Handles Inngest API requests
 * - Implements CORS headers for cross-browser compatibility
 */

import { NextRequest, NextResponse } from "next/server";

// Configure CORS headers as specified
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // 24 hours
};

/**
 * Handle OPTIONS requests (preflight) for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Handle POST requests to the Inngest API
 */
export async function POST(req: NextRequest) {
  try {
    // Get request body as JSON
    const body = await req.json();
    
    // Process the request (implement your actual logic here)
    // This is a placeholder - replace with your actual implementation
    const result = { success: true, message: "Inngest request processed" };
    
    // Return successful response with CORS headers
    return NextResponse.json(result, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Inngest API error:", error);
    
    // Return error response with CORS headers
    return NextResponse.json(
      { error: "Failed to process Inngest request" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
