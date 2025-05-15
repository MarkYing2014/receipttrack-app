'use client';

import { useEffect, useState } from 'react';

/**
 * NoHydration completely avoids hydration mismatches by not rendering 
 * children content on the server at all - the client-only content will
 * only appear after React hydration is complete
 */
export default function NoHydration({
  children,
  fallback = null
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing during SSR and initial client render
  // This ensures we never have hydration mismatches
  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
