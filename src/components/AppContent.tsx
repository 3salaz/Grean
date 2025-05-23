import { IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router-dom";
import { appRoutes } from "../routes/routes";
import { useMemo } from "react";
import { useTab } from "../context/TabContext";
import Layout from "../layouts/Layout";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const AppContent: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location]);
  const { activeTab, setActiveTab } = useTab();
  const routes = useMemo(() => appRoutes(activeTab, setActiveTab), [activeTab]);

  return (
    <IonRouterOutlet>
      {routes.map(({ path, element }, i) => (
        <Route
          key={i}
          path={path}
          render={() => (
            <>{element}</>
          )}
        />
      ))}
    </IonRouterOutlet>
  );
};

export default AppContent;

