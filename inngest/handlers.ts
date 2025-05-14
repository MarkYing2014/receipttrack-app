import { inngest } from "@/inngest.config";
import { api } from "@/convex/_generated/api";
import { convex } from "@/lib/convex";

// Handler for when a new receipt is created
export const processNewReceipt = inngest.createFunction(
  { id: "process-new-receipt" },
  { event: "receipt/created" },
  async ({ event, step }) => {
    const { receiptId, amount, merchant, category, date } = event.data;

    // Log receipt creation
    await step.log("Processing new receipt", { 
      receiptId, 
      merchant, 
      amount 
    });

    try {
      // Example: Additional processing steps for the receipt
      // This could include OCR processing, category validation, etc.
      const result = await step.run("validate-receipt-data", async () => {
        // Validation logic
        const isValid = amount > 0 && merchant && category && date;
        
        if (!isValid) {
          throw new Error("Invalid receipt data");
        }
        
        return { isValid, validatedAt: new Date().toISOString() };
      });

      // Example: You could update the receipt status in Convex
      // This would be done in practice if needed
      /*
      await step.run("update-receipt-status", async () => {
        return await convex.mutation(api.receipts.updateReceiptStatus, {
          id: receiptId,
          status: "processed",
          validatedAt: result.validatedAt
        });
      });
      */

      // Send an event when processing is complete
      await step.sendEvent("receipt/processed", {
        data: {
          receiptId,
          status: "success",
          message: "Receipt processed successfully"
        }
      });

      return { 
        success: true, 
        receiptId,
        message: "Receipt processed successfully" 
      };
    } catch (error) {
      // Handle any errors during processing
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      await step.sendEvent("receipt/processed", {
        data: {
          receiptId,
          status: "failure",
          message: errorMessage
        }
      });

      return { 
        success: false, 
        receiptId,
        error: errorMessage 
      };
    }
  }
);

// Handler for when a receipt is processed (successfully or not)
export const handleProcessedReceipt = inngest.createFunction(
  { id: "handle-processed-receipt" },
  { event: "receipt/processed" },
  async ({ event, step }) => {
    const { receiptId, status, message } = event.data;

    await step.log("Receipt processing complete", { 
      receiptId, 
      status, 
      message 
    });

    // Example: Different actions based on processing status
    if (status === "success") {
      // Handle successful processing
      // E.g., notify user, update analytics, etc.
      await step.run("handle-success", async () => {
        // Success handling logic
        return { notified: true };
      });
    } else {
      // Handle processing failure
      // E.g., retry, notify admin, etc.
      await step.run("handle-failure", async () => {
        // Failure handling logic
        return { errorLogged: true };
      });
    }

    return {
      receiptId,
      status,
      handledAt: new Date().toISOString()
    };
  }
);

// Export all handlers as an array for easy import
export const receiptHandlers = [
  processNewReceipt,
  handleProcessedReceipt
];
