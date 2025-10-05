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
import "react-toastify/dist/ReactToastify.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import AppContent from "./components/AppContent";

function App() {
  return (
    <IonApp>
      <IonReactRouter>
          <AppContent />
      </IonReactRouter>
    </IonApp>
  );
}


export default App;
