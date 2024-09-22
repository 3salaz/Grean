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
import "./theme/ionStyle.css";


// React
import { Switch, Route, Redirect } from "react-router-dom";
import { IonApp, IonContent, IonHeader, IonRouterOutlet } from "@ionic/react";
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
import ProtectedRoute from "./routes/ProtectedRoute";
import SideMenu from "./components/Layout/SideMenu";

function App() {
  return (
    <IonApp>
      <AuthProfileProvider>
        <LocationsProvider>
          <PickupsProvider>
            <IonReactRouter>
              <SideMenu />
              <Navbar />
              <IonContent id="content" scroll-y="false">
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
