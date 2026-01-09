import React from 'react';

import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="bg-bg text-text-primary m-0 flex overflow-hidden p-0">
      <Sidebar />

      <main className="h-screen flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
