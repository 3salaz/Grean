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
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Main Styles
import "./styles/index.css";

// React
import {Switch, Route, Redirect} from "react-router-dom";
import {IonApp, IonContent, IonRouterOutlet} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";

// Context
import {AuthProvider} from "./context/AuthContext";
import {ProfileProvider} from "./context/ProfileContext";
import {PickupsProvider} from "./context/PickupsContext";
import {LocationsProvider} from "./context/LocationsContext";

// Component
import Navbar from "./components/Layout/Navbar";

// Routes
import Home from "./pages/Home";
import Account from "./pages/Account";
import ProtectedRoute from "./pages/ProtectedRoute";
// import SideMenu from "./components/Layout/SideMenu";

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <ProfileProvider>
          <LocationsProvider>
            <PickupsProvider>
              <IonReactRouter>
                {/* <SideMenu /> */}
                <Navbar />
                <IonContent
                  scroll-y="false"
                  className="bg-gradient-to-t from-grean to-blue-300"
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
