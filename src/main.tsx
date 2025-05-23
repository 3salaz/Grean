import React from "react";
import { createRoot } from "react-dom/client";
import { setupIonicReact } from "@ionic/react";
import App from "./App";

import "./styles/index.css";
import AppProviders from "./context/AppProviders";

setupIonicReact();

const rootElement = document.getElementById("root");

createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
