import "./App.css";
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
import { Switch, Route, Redirect } from "react-router-dom";
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

  return (
    <IonApp>
      <AuthProfileProvider>
        <LocationsProvider>
          <PickupsProvider>
            <IonReactRouter>
              <div id="app-wrapper" className="flex flex-col h-screen">
                <Navbar />
                <IonContent id="content" className="h-[92svh]">
                  <IonRouterOutlet>
                    <Switch>
                      <Route path="/home" exact component={Home} />

                      <Route path="/account"
                        render={() => (
                          <ProtectedRoute>
                            <Account />
                          </ProtectedRoute>
                        )}
                      />
                      <Route path="/settings"
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
              </div>
            </IonReactRouter>
          </PickupsProvider>
        </LocationsProvider>
      </AuthProfileProvider>
    </IonApp>
  );
}

export default App;