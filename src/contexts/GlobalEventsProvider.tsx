import React, { useEffect, useState } from 'react';
import { subscribeToCsvImportEvents } from '@utils/globalEvents';

import ErrorModal from '@/components/modals/ErrorModal';
import { GlobalEventsContext } from './GlobalEventsContext';

export function GlobalEventsProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCsvImportEvents(setError);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <GlobalEventsContext.Provider value={{ setError }}>
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}
      {children}
    </GlobalEventsContext.Provider>
  );
}
