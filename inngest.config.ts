import { Inngest } from "inngest";

// Initialize Inngest client
export const inngest = new Inngest({
  id: "receipt-tracker",
  // For development, we'll use the testing environment
  // In production, you would use your Inngest API key
  env: process.env.NODE_ENV === "production" 
    ? undefined  // Uses INNGEST_* env vars in production
    : { 
        signing: { 
          key: process.env.INNGEST_SIGNING_KEY || "dev" 
        }
      }
});

// Define event schemas (for type-safety)
export type ReceiptEvents = {
  "receipt/created": {
    data: {
      receiptId: string;
      amount: number;
      date: string;
      merchant: string;
      category: string;
      description?: string;
      imageUrl?: string;
    };
  };
  "receipt/processed": {
    data: {
      receiptId: string;
      status: "success" | "failure";
      message?: string;
    };
  };
};
