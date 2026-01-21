import { createContext } from 'react';

interface BackgroundTaskContextType {
  createBackgroundTask: (taskId: string) => void;
}

export const BackgroundTasksContext = createContext<BackgroundTaskContextType>({
  createBackgroundTask: () => {},
});
