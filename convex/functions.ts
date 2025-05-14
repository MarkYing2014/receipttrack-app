import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Define a mutation function to store a new receipt
export const storeReceipt = mutation({
  // Validate the input arguments
  args: {
    amount: v.number(),
    date: v.string(),
    merchant: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  
  // Function implementation
  handler: async (ctx, args) => {
    // Create a receipt object with all the provided fields
    const receipt = {
      amount: args.amount,
      date: args.date,
      merchant: args.merchant,
      category: args.category,
      description: args.description,
      imageUrl: args.imageUrl,
      createdAt: new Date().toISOString(),
    };
    
    // Insert the receipt into the "receipts" table and return the ID
    const id = await ctx.db.insert("receipts", receipt);
    
    // Return the created receipt with its ID
    return { id, ...receipt };
  },
});

// Define a query function to fetch receipts
export const getReceipts = query({
  // Optional arguments for filtering and pagination
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  
  // Function implementation
  handler: async (ctx, args) => {
    // Start with a query to the receipts table
    let receiptsQuery = ctx.db.query("receipts");
    
    // If a category filter is provided, apply it
    if (args.category) {
      receiptsQuery = receiptsQuery.filter((q) => 
        q.eq(q.field("category"), args.category)
      );
    }
    
    // First collect all matching documents
    const results = await receiptsQuery.collect();
    
    // Sort by createdAt (newest first)
    results.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Apply limit
    const limit = args.limit || 50;
    return results.slice(0, limit);
  },
});

// Function to get a single receipt by ID
export const getReceiptById = query({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
