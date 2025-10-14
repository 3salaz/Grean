import React, { useEffect, useState } from "react";
import { IonGrid, IonRouterOutlet } from "@ionic/react";
import { Route, Redirect, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import logo from "../assets/logo.png";

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location]);

  // Temporary splash screen
  if (loading) {
    return (
      <IonGrid className="h-screen w-full flex items-center justify-center bg-[#75B657]">
        <img src={logo} alt="Grean Logo" className="animate-spin w-24 h-24" />
      </IonGrid>
    );
  }

  // Just render Home directly with a simple redirect
  return (
    <IonRouterOutlet>
      <Route exact path="/" render={() => <Redirect to="/home" />} />
      <Route exact path="/home" component={Home} />
    </IonRouterOutlet>
  );
};

export default AppContent;