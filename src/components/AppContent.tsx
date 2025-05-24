import { IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router-dom";
import { appRoutes } from "../routes/routes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AppContent: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location]);

  const routes = appRoutes();

  return (
    <IonRouterOutlet>
      {routes.map(({ path, element }, i) => (
        <Route key={i} path={path} render={() => <>{element}</>} />
      ))}
    </IonRouterOutlet>
  );
};

export default AppContent;


