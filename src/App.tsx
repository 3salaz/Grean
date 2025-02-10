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
import "mapbox-gl/dist/mapbox-gl.css";

// Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// User Themes
import "./styles/ionStyle.css";

// React
import { Switch, Route, Redirect } from "react-router-dom";
import { IonApp, IonContent, IonHeader, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

// Context
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PickupsProvider } from "./context/PickupsContext";
import { LocationsProvider } from "./context/LocationsContext";

// Component
import Navbar from "./components/Layout/Navbar";

// Routes
import Home from "./pages/Home";
import Account from "./pages/Account";
import ProtectedRoute from "./pages/ProtectedRoute";
import SideMenu from "./components/Layout/SideMenu";
import Profile from "./components/Layout/Tabs/Profile/Profile";

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <ProfileProvider>
          <LocationsProvider>
            <PickupsProvider>
              <IonReactRouter>
                <SideMenu />
                <Navbar />
                <IonContent
                  id="content"
                  scroll-y="false"
                  className="bg-gradient-to-t from-grean to-blue-300 p-2"
                >
                  <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                  />
                  <IonRouterOutlet>
                    <Switch>
                      <Redirect exact from="/" to="/home" />
                      <Route path="/home" exact component={Home} />
                      <Route
                        path="/account"
                        render={() => (
                          <ProtectedRoute>
                              <Account />
                          </ProtectedRoute>
                        )}
                      />
                    </Switch>
                  </IonRouterOutlet>
                </IonContent>
              </IonReactRouter>
            </PickupsProvider>
          </LocationsProvider>
        </ProfileProvider>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
