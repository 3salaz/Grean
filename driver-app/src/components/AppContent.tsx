import { IonGrid, IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { appRoutes } from "../routes/routes";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from '../assets/logo.png';

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800); // Simulate load
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location]);

  const routes = appRoutes();


  if (loading) {
    return (
      <IonGrid className="bg-[#75B657] h-screen w-full">
      <div className="flex items-center justify-center h-screen bg-white transition-opacity duration-700">
        <img
          src={logo}
          alt="Grean Logo"
          className="animate-spin w-24 h-24"
        />
      </div>
      </IonGrid>
    );
  }

  return (
    <IonRouterOutlet>
    {routes.map(({ path, element }, i) =>
      element.type?.name === "Redirect" ? (
        <Redirect key={i} exact from={path} to={element.props.to} />
      ) : (
        <Route key={i} exact path={path} render={() => <>{element}</>} />
      )
    )}
  </IonRouterOutlet>
  
  );
};

export default AppContent;


