// inngest/handlers.ts
import { inngest } from '../inngest.config';

// Process new receipt function that responds to receipt.created events
export const processNewReceipt = inngest.createFunction(
  { id: 'process-new-receipt' },
  { event: 'receipt.created' },
  async ({ event, step }) => {
    // Log receipt via console for debugging (step.log was causing a type error)
    console.log('New receipt received', event.data);
    
    // Your processing logic here
    // Example: notify user, update stats, etc.
    
    return {
      success: true,
      receipt: event.data,
      processedAt: new Date().toISOString(),
    };
  }
);

// Export all handlers as an array
export const receiptHandlers = [
  processNewReceipt,
];

// Default export for better discovery
export default receiptHandlers;