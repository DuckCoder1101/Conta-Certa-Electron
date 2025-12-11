import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { GlobalEventsProvider } from '@contexts/GlobalEventsProvider';
import SettingsProvider from '@contexts/SettingsProvider';

import Dashboard from '@pages/Dashboard';

import ClientForm from '@pages/ClientForm';
import ClientsList from '@pages/ClientsList';

import BillingForm from '@pages/BillingForm';
import BillingsList from '@pages/BillingsList';

import ServiceForm from '@pages/ServiceForm';
import ServicesList from '@pages/ServicesList';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <GlobalEventsProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/clients/list" element={<ClientsList />} />
            <Route path="/clients/new" element={<ClientForm />} />

            <Route path="/billings/list" element={<BillingsList />} />
            <Route path="/billings/new" element={<BillingForm />} />

            <Route path="/services/list" element={<ServicesList />} />
            <Route path="/services/new" element={<ServiceForm />} />
          </Routes>
        </HashRouter>
      </GlobalEventsProvider>
    </SettingsProvider>
  </React.StrictMode>,
);
