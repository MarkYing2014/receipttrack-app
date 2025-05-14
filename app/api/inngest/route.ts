// Next.js App Router implementation based on official Inngest docs
// https://www.inngest.com/docs/learn/serving-inngest-functions

import { serve } from "inngest/next";
import { inngest } from "@/inngest.config";

// Test function
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", 1000); 
    return { message: `Hello ${event.data.name || 'world'}!` };
  }
);

// Receipt processing function
const processNewReceipt = inngest.createFunction(
  { id: "process-new-receipt" },
  { event: "receipt/created" },
  async ({ event, step }) => {
    // Log receipt information
    const receipt = event.data;
    console.log(`Processing new receipt: ${receipt.merchant} - $${receipt.amount}`);
    
    // Add a delay to simulate processing time
    await step.sleep("processing-delay", 500);
    
    // Process receipt data (this is where you could add more receipt processing logic)
    const result = await step.run("process-receipt-data", async () => {
      // Example: categorize receipt based on merchant name
      let suggestedCategory = receipt.category;
      
      if (!suggestedCategory) {
        const merchantLower = receipt.merchant.toLowerCase();
        if (merchantLower.includes('market') || merchantLower.includes('grocery')) {
          suggestedCategory = 'Food';
        } else if (merchantLower.includes('gas') || merchantLower.includes('transport')) {
          suggestedCategory = 'Transportation';
        }
      }
      
      return {
        receiptId: receipt.id,
        suggestedCategory,
        processedAt: new Date().toISOString()
      };
    });
    
    // Return the processing result
    return result;
  }
);

// Export a handler for Next.js App Router
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, processNewReceipt],
  serveHost: undefined, // This is important for Next.js App Router
});

// Add OPTIONS handler for CORS as recommended by Inngest docs
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}
