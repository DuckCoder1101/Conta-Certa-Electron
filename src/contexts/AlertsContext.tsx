import { createContext } from 'react';

import { ToastInfo } from '@t/toastInfo';

export interface AlertsContextType {
  addToast: (info: ToastInfo) => void;
}

export const AlertsContext = createContext<AlertsContextType>({
  addToast: () => {},
});
