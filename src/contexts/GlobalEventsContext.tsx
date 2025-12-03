import { createContext } from "react";

export interface GlobalEventsContextType {
  setError: (msg: string | null) => void;
}

export const GlobalEventsContext = createContext<GlobalEventsContextType>({
  setError: () => {},
});
