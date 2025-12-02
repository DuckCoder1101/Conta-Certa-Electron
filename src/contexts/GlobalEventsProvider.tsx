import React, { useEffect, useState, createContext } from "react";
import { subscribeToCsvImportEvents } from "@utils/globalEvents";
import ErrorModal from "@/components/ErrorModal";

export const GlobalEventsContext = createContext({
  setGlobalError: (msg: string | null) => {},
});

export function GlobalEventsProvider({ children }: { children: React.ReactNode }) {
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCsvImportEvents(setGlobalError);
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <GlobalEventsContext.Provider value={{ setGlobalError }}>
      {globalError && (
        <ErrorModal error={globalError} onClose={() => setGlobalError(null)} />
      )}
      {children}
    </GlobalEventsContext.Provider>
  );
}
