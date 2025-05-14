/**
 * Simple event handling system for the ReceiptTrack app
 * Use this as a temporary replacement for Inngest while resolving integration issues
 */

// Event types
export type ReceiptEvent = {
  name: string;
  data: {
    id?: string;
    amount: number;
    date: string;
    merchant: string;
    category?: string;
    description?: string;
    imageUrl?: string;
  };
};

// Simple event handlers (can be expanded later)
export const handleReceiptCreated = async (event: ReceiptEvent) => {
  console.log('Receipt created:', event.data);
  
  // This is where you would normally put processing logic
  // For example: send notifications, generate reports, etc.
  
  return {
    success: true,
    receipt: event.data,
    processedAt: new Date().toISOString(),
  };
};

// Event dispatch function
export const dispatchEvent = async (event: ReceiptEvent) => {
  // Simple routing based on event name
  switch (event.name) {
    case 'receipt.created':
      return await handleReceiptCreated(event);
    default:
      console.warn(`Unknown event type: ${event.name}`);
      return { success: false, error: `Unknown event type: ${event.name}` };
  }
};

// Function to trigger a receipt.created event
export const triggerReceiptCreated = async (receiptData: ReceiptEvent['data']) => {
  const event: ReceiptEvent = {
    name: 'receipt.created',
    data: receiptData
  };
  
  return await dispatchEvent(event);
};
