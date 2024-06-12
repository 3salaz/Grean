import "./App.css";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { PickupsProvider } from "./context/PickupsContext";

// Toast Messages
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Routes
import Home from "./routes/Home";
import Account from "./routes/Account";
import ProtectedRoute from "./routes/ProtectedRoute";

// Components
import Navbar from "./components/Layout/Navbar";
import Tabbar from "./components/Layout/TabBar";
import Settings from "./routes/Settings";
import { ProfileProvider } from "./context/ProfileContext";
import { LocationsProvider } from "./context/LocationsContext";
import Setup from "./routes/Setup";

function App() {
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation(); // Get the current path

  return (
    <AuthContextProvider>
      <Navbar />
      <main className="h-[82svh] w-full bg-white relative">
        {/* Added relative */}
        <ToastContainer
          position="top-center"
          style={{ top: "8%", left: "50%", transform: "translateX(-50%)" }}
        />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <ProfileProvider>
                  <LocationsProvider>
                    <PickupsProvider>
                      <Account active={activeTab} />
                    </PickupsProvider>
                  </LocationsProvider>
                </ProfileProvider>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/setup"
            element={
              <ProfileProvider>
                <LocationsProvider>
                  <PickupsProvider>
                    <Setup/>
                  </PickupsProvider>
                </LocationsProvider>
              </ProfileProvider>
            }
          ></Route>
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfileProvider>
                  <LocationsProvider>
                    <PickupsProvider>
                      <Settings />
                    </PickupsProvider>
                  </LocationsProvider>
                </ProfileProvider>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </main>
      {location.pathname !== "/setup" && location.pathname !== "/settings" && location.pathname !== "/" && (
        <Tabbar active={activeTab} setActive={setActiveTab} />
      )}
    </AuthContextProvider>
  );
}

export default App;
