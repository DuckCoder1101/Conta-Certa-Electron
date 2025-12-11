import React, { useContext, useEffect } from 'react';

import Sidebar from './Sidebar';
import { SettingsContext } from '@/contexts/SettingsContext';
import i18next from 'i18next';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    if (settings != null) {
      i18next.changeLanguage(settings.language);
    }
  }, [settings])

  return (
    <div className="m-0 flex overflow-hidden bg-light-bg2 p-0 text-light-text">
      <Sidebar />

      <main className="h-screen flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
