import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {setupIonicReact} from "@ionic/react";
import App from "./App";

// Initialize Ionic React
setupIonicReact();

// Fix ResizeObserver loop limit error
if (window.ResizeObserver) {
  const resizeObserverErrSilenced = (err: ErrorEvent) =>
    err.message.includes("ResizeObserver loop limit exceeded");
  window.addEventListener("error", (err: ErrorEvent) => {
    if (resizeObserverErrSilenced(err)) {
      err.stopImmediatePropagation();
    }
  });
}

// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
