import React from 'react';

import Sidebar from '@components/Sidebar';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="m-0 flex h-screen overflow-hidden bg-light-bg2 text-light-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-8">{children}</main>
    </div>
  );
}
