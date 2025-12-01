import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Dashboard from '@pages/Dashboard';
import ClientsList from '@/pages/ClientsList';
import BillingsList from './pages/BillingsList';

ReactDOM.createRoot(document.querySelector('#root')!).render(
	<React.StrictMode>
		<HashRouter>
			<Routes>
				<Route path='/' element={<Dashboard />} />
				<Route path='/clients/list' element={<ClientsList />} />
				<Route path='/billings/list' element={<BillingsList />} />
			</Routes>
		</HashRouter>
	</React.StrictMode>
);
