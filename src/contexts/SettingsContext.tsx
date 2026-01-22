import { createContext } from 'react';

import ISettings from '@t/Schemas';

export interface SettingsContextType {
  settings: ISettings | null;
  updateSettings?: (settings: ISettings) => void;
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: false,
});
