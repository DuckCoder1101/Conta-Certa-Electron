import { createContext } from 'react';

import IConfiguration from '@t/configuration';

export interface SettingsContextType {
  settings: IConfiguration | null;
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: false,
});
