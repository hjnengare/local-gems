import { useEffect, useState } from 'react';

/**
 * Utility hook to safely detect if component has mounted on client
 * Prevents hydration mismatches when using client-only code
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}