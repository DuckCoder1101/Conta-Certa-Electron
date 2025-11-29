import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Dashboard from '@pages/dashboard/Dashboard';
import ClientsList from '@pages/clients/ClientsList';

ReactDOM.createRoot(document.querySelector('#root')!).render(
	<React.StrictMode>
		<HashRouter>
			<Routes>
				<Route path='/' element={<Dashboard />}></Route>
				<Route path='/clients/list' element={<ClientsList />}></Route>
			</Routes>
		</HashRouter>
	</React.StrictMode>
);
