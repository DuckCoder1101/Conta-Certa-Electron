import React, { useState, useEffect } from 'react';

import { SettingsContext } from './SettingsContext';

import IConfiguration from '@t/configuration';
import { IAppResponseDTO } from '@t/dtos';

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<IConfiguration | null>(null);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      const { data } = await window.api.invoke('get-settings') as IAppResponseDTO<IConfiguration>;
      if (data) {
        setSettings(data);
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <SettingsContext.Provider value={{ isLoading, settings }}>
      {children}
    </SettingsContext.Provider>
  )
}