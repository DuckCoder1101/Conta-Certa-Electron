import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsContext } from './SettingsContext';
import { changeLanguage } from 'i18next';

import ISettings from '@t/Schemas';
import { IAppResponse } from '@t/AppResponse';

import { AlertsContext } from '@contexts/AlertsContext';

const defaultConfig: ISettings = {
  autoBackup: true,
  autoBilling: true,
  autoUpdate: true,
  language: 'pt-BR',
  theme: 'dark',
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useContext(AlertsContext);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<ISettings | null>(null);

  const updateSettings = async (newSettings: ISettings) => {
    if (!newSettings || !settings) return;

    // Evita salvar se não houve mudança
    if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
      const { success, error } = (await window.api.invoke('set-settings', newSettings)) as IAppResponse;

      if (success) {
        setSettings(newSettings);
      } else if (error) {
        showToast({
          title: 'Erro ao salvar configurações!',
          type: 'error',
          message: t(error.code, error.params),
        });
      }
    }
  };

  // Carrega as configurações iniciais
  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const { data, error } = (await window.api.invoke('get-settings')) as IAppResponse<ISettings>;

      if (data) {
        setSettings(data);
      } else {
        setSettings(defaultConfig);

        if (error) {
          showToast({
            title: 'Erro ao carregar configurações!',
            type: 'warning',
            message: t(error.code, error.params),
          });
        }
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToast]);

  // Atualiza o idioma e o tema
  useEffect(() => {
    if (!settings) return;

    document.documentElement.dataset.theme = settings.theme;
    changeLanguage(settings.language);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ isLoading, settings, updateSettings }}>{children}</SettingsContext.Provider>
  );
}
