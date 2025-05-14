'use client';

import { Suspense } from 'react';
import ReceiptForm from './components/ReceiptForm';
import ReceiptList from './components/ReceiptList';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Create a Convex client for client components
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

export default function Home() {
  return (
    <ConvexProvider client={convex}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ReceiptTrack</h1>
            <p className="text-lg text-gray-600">Track your receipts and expenses efficiently</p>
          </header>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
                <ReceiptForm />
              </Suspense>
            </div>
            
            <div className="md:col-span-7">
              <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
                <ReceiptList />
              </Suspense>
            </div>
          </div>
          
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} ReceiptTrack App</p>
          </footer>
        </div>
      </div>
    </ConvexProvider>
  );
}
