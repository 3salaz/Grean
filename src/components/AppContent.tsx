import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonFooter,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { Redirect, Route, useLocation } from "react-router-dom";

import Navbar from "./Layout/Navbar";
import Home from "../pages/Home";
import Account from "../pages/Account";
import Testing from "../pages/Testing";
import ProtectedRoute from "../pages/ProtectedRoute";

import {
  leafOutline,
  navigateCircleOutline,
  personCircleOutline,
  statsChartOutline,
} from "ionicons/icons";
import Footer from "./Layout/Footer";

type TabOption = "profile" | "pickups" | "map" | "stats";

const AppContent: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabOption>("profile");

  const hideNavbarRoutes: string[] = [];

  const showFooterRoutes = ["/account"];

  return (
    <IonPage className="flex flex-col">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

        <IonRouterOutlet>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/home" component={Home} />
          <Route path="/testing" component={Testing} />
          <Route
            path="/account"
            render={() => (
              <ProtectedRoute>
                <Account activeTab={activeTab} setActiveTab={setActiveTab} />
              </ProtectedRoute>
            )}
          />
        </IonRouterOutlet>

      {showFooterRoutes.includes(location.pathname) && (
        <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </IonPage>
  );
};

export default AppContent;
