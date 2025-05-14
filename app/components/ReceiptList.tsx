'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatDistance } from 'date-fns';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString; // Fallback to original string
  }
};

const ReceiptList = () => {
  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  
  // Fetch receipts from Convex
  const receipts = useQuery(api.functions.getReceipts, { 
    category: categoryFilter,
    limit: 50 
  });
  
  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryFilter(value === '' ? undefined : value);
  };
  
  // Calculate total amount
  const totalAmount = receipts?.reduce((sum: number, receipt: any) => sum + receipt.amount, 0) || 0;
  
  if (receipts === undefined) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (receipts.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Receipts</h2>
        <div className="flex justify-between items-center mb-6">
          <div>
            <select
              value={categoryFilter || ''}
              onChange={handleCategoryChange}
              className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Housing">Housing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="text-lg font-semibold">
            Total: {formatCurrency(totalAmount)}
          </div>
        </div>
        <div className="text-center py-10 text-gray-500">
          No receipts found. Add your first receipt using the form above.
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Receipts</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <select
            value={categoryFilter || ''}
            onChange={handleCategoryChange}
            className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Housing">Housing</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="text-lg font-semibold">
          Total: {formatCurrency(totalAmount)}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Merchant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts.map((receipt: any) => (
              <tr key={receipt._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(receipt.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {receipt.merchant}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {receipt.category || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {receipt.description || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {formatCurrency(receipt.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {receipts.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'}
        </div>
      )}
    </div>
  );
};

export default ReceiptList;
