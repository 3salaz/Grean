// App.tsx
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// React
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// Context
import { AuthProfileProvider } from "./context/AuthProfileContext";
import { PickupsProvider } from "./context/PickupsContext";
import { LocationsProvider } from "./context/LocationsContext";

// Component
import Navbar from "./components/Layout/Navbar";
import Tabbar from "./components/Layout/TabBar";

// Routes
import Home from "./routes/Home";
import Setup from "./routes/Setup";
import Account from "./routes/Account";
import Settings from "./routes/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation(); // Get the current path

  return (
    <AuthProfileProvider>
        <LocationsProvider>
          <PickupsProvider>
            <Navbar /> 
            <main className="h-[82svh] w-full bg-white relative z-20">
              <ToastContainer
                position="top-center"
                style={{ width: "100%", top: "8%", left: "50%", transform: "translateX(-50%)" }}
              />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account active={activeTab} />
                    </ProtectedRoute>
                  }
                />
                <Route path="/setup" element={<Setup />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            {location.pathname !== "/setup" &&
              location.pathname !== "/settings" &&
              location.pathname !== "/" && (
                <Tabbar active={activeTab} setActive={setActiveTab} />
              )}
          </PickupsProvider>
        </LocationsProvider>
    </AuthProfileProvider>
  );
}

export default App;
