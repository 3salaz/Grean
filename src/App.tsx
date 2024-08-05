import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

// React
import { useState } from "react";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { IonApp, IonContent, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

// Context
import { AuthProfileProvider } from "./context/AuthProfileContext";
import { PickupsProvider } from "./context/PickupsContext";
import { LocationsProvider } from "./context/LocationsContext";

// Component
import Navbar from "./components/Layout/Navbar";

// Routes
import Home from "./routes/Home";
import Account from "./routes/Account";
import Settings from "./routes/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const location = useLocation();

  return (
    <IonApp>
      <AuthProfileProvider>
        <LocationsProvider>
          <PickupsProvider>
            <IonReactRouter>
              <Navbar />
              <IonContent className="h-82vh">
                <ToastContainer
                  position="top-center"
                  style={{
                    width: "100%",
                    top: "8%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
                <IonRouterOutlet>
                  <Switch>
                    <Route path="/home" exact component={Home} />
                    <Route
                      path="/account"
                      render={() => (
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      )}
                    />
                    <Route
                      path="/settings"
                      render={() => (
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      )}
                    />
                    <Redirect exact from="/" to="/home" />
                  </Switch>
                </IonRouterOutlet>
              </IonContent>
            </IonReactRouter>
          </PickupsProvider>
        </LocationsProvider>
      </AuthProfileProvider>
    </IonApp>
  );
}

export default App;
