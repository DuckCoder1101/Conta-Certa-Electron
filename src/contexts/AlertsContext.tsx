import { createContext } from 'react';

import { IToastInfo } from '@t/Toast';

export interface AlertsContextType {
  showToast: (info: IToastInfo) => void;
  updateToastProgress: (toastId: string, progress: number) => void;
  removeToast: (id: string) => void;
}

export const AlertsContext = createContext<AlertsContextType>({
  showToast: () => {},
  updateToastProgress: () => {},
  removeToast: () => {},
});
