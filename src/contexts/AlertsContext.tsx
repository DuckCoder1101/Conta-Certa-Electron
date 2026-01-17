import { createContext } from 'react';

import { IToastInfo } from '@t/Toast';

export interface AlertsContextType {
  showToast: (info: IToastInfo) => void;
}

export const AlertsContext = createContext<AlertsContextType>({
  showToast: () => {},
});
