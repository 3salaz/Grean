import { ReactNode } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { useLocation } from "react-router-dom";
import { IonContent, IonFooter, IonHeader, IonPage } from "@ionic/react";
import { useTab } from "../context/TabContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { activeTab, setActiveTab } = useTab();

  const hideNavbarRoutes: string[] = ["/", "/home"];
  const showFooterRoutes: string[] = ["/account"];

  return (
    <IonPage>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <IonHeader>
          <Navbar />
        </IonHeader>
      )}

      <IonContent fullscreen className="keyboard-fix">
        {children}
      </IonContent>

      {showFooterRoutes.includes(location.pathname) && (
        <IonFooter>
          <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
        </IonFooter>
      )}
    </IonPage>
  );
};

export default Layout;
