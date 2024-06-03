import "./App.css";
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
import Navbar from "./components/Navigation/Navbar";
import Tabbar from "./components/Navigation/TabBar";


import Admin from "./routes/Admin";
import Contact from "./routes/Contact";
import About from "./routes/About";
import Services from "./routes/Services";
import { ProfileProvider } from "./context/ProfileContext";
import { LocationsProvider } from "./context/LocationContext";
import Settings from "./routes/Settings";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation(); // Get the current path

  return (
    <AuthContextProvider>
      <ToastContainer />
      <Navbar />
      <main className="h-[82svh] w-full bg-white">
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
          <Route path="/about" element={<About />}></Route>
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
          <Route path="/services" element={<Services />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
        </Routes>
      </main>
      {location.pathname !== "/settings" && location.pathname !== "/" && (
        <Tabbar active={activeTab} setActive={setActiveTab} />
      )}
    </AuthContextProvider>
  );
}

export default App;
