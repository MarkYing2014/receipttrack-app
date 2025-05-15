'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import NoHydration from './NoHydration';

const ReceiptForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '', // Will be set properly client-side
    merchant: '',
    category: '',
  });
  
  // Form submission status
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get the Convex mutation function
  const storeReceipt = useMutation(api.functions.storeReceipt);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? value : value,
    }));
  };
  
    // Set the date on the client side only
  const todayDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setStatus('submitting');
      
      // Validate required fields
      if (!formData.merchant.trim()) {
        throw new Error('Merchant name is required');
      }
      
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Amount must be a positive number');
      }
      
      // Call the Convex mutation to store the receipt
      const result = await storeReceipt({
        amount,
        date: formData.date,
        merchant: formData.merchant,
        category: formData.category || undefined,
        description: formData.description || undefined,
      });
      
      // Send a receipt/created event to Inngest
      await fetch('/api/inngest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'receipt/created',
          data: {
            id: result.id,
            amount,
            date: formData.date,
            merchant: formData.merchant,
            category: formData.category || undefined,
            description: formData.description || undefined,
          },
        }),
      });
      
      // Reset form and update status
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        merchant: '',
        category: '',
      });
      
      setStatus('success');
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };
  
  return (
    <NoHydration fallback={
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Receipt</h2>
        <p>Loading form...</p>
      </div>
    }>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Receipt</h2>
      
      {status === 'success' && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          Receipt added successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Merchant Field */}
          <div className="mb-4">
            <label htmlFor="merchant" className="block text-sm font-medium text-gray-700 mb-1">
              Merchant *
            </label>
            <input
              type="text"
              id="merchant"
              name="merchant"
              value={formData.merchant}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
              placeholder="Store or vendor name"
            />
          </div>
          
          {/* Amount Field */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
              placeholder="0.00"
            />
          </div>
          
          {/* Date Field */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date || todayDate()}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          
          {/* Category Field */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
            >
              <option value="">Select a category</option>
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
        </div>
        
        {/* Description Field */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
            placeholder="Optional details about this purchase"
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            status === 'submitting' ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {status === 'submitting' ? 'Adding Receipt...' : 'Add Receipt'}
        </button>
      </form>
    </div>
    </NoHydration>
  );
};

export default ReceiptForm;
