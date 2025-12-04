import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import Dashboard from "@pages/Dashboard";
import ClientsList from "@/pages/ClientsList";
import BillingsList from "@/pages/BillingsList";
import ClientForm from "@/pages/ClientForm";

import { GlobalEventsProvider } from "@contexts/GlobalEventsProvider";
import BillingForm from "./pages/BillingForm";
import ServicesList from "./pages/ServicesList";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <GlobalEventsProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients/list" element={<ClientsList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/billings/list" element={<BillingsList />} />
          <Route path="/billings/new" element={<BillingForm />} />
          <Route path="/services/list" element={<ServicesList />} />
        </Routes>
      </HashRouter>
    </GlobalEventsProvider>
  </React.StrictMode>
);
