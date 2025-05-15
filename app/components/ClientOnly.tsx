'use client';

import { useState, useEffect } from 'react';

export default function ClientOnly({ 
  children,
  fallback = null
}: { 
  children: React.ReactNode,
  fallback?: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
