// inngest.config.ts
import { Inngest } from 'inngest';

// Create Inngest client with explicit configuration
export const inngest = new Inngest({ 
  id: 'receipttrack-app',
  // These can be empty during local development with the dev server
  // The dev server will provide ephemeral keys
});

// Export the client to ensure it's accessible
export default inngest;