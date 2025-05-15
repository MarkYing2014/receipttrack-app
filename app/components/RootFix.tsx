'use client';

import { useEffect, useState } from 'react';

/**
 * A component that completely replaces the HTML and body elements
 * to avoid hydration issues at the root level
 */
export default function RootFix({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      data-mounted={mounted}
      className="min-h-screen"
    >
      {children}
    </div>
  );
}
