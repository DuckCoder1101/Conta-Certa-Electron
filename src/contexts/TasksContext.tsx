import { createContext } from 'react';

interface BackgroundTaskContextType {
  startTask: (taskId: string) => void;
}

export const TasksContext = createContext<BackgroundTaskContextType>({
  startTask: () => {},
});
