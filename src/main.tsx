import './index.css';
import './i18n';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { AlertsProvider } from '@contexts/AlertsProvider';
import { SettingsProvider } from '@contexts/SettingsProvider';

import Dashboard from '@pages/Dashboard';

import ClientForm from '@pages/ClientForm';
import ClientsList from '@pages/ClientsList';

import BillingForm from '@pages/BillingForm';
import BillingsList from '@pages/BillingsList';

import ServiceForm from '@pages/ServiceForm';
import ServicesList from '@pages/ServicesList';
import BackupsList from '@pages/BackupsList';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <AlertsProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/clients/list" element={<ClientsList />} />
            <Route path="/clients/new" element={<ClientForm />} />

            <Route path="/billings/list" element={<BillingsList />} />
            <Route path="/billings/new" element={<BillingForm />} />

            <Route path="/services/list" element={<ServicesList />} />
            <Route path="/services/new" element={<ServiceForm />} />

            <Route path="/backups" element={<BackupsList />} />
          </Routes>
        </HashRouter>
      </AlertsProvider>
    </SettingsProvider>
  </React.StrictMode>,
);
