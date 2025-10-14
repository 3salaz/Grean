import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout — wraps every page with Navbar & Footer.
 * Use this in AppContent around your <Routes />.
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <IonPage>
      <Navbar />

      {/* Main content area */}
      <IonContent fullscreen>
        <div className="app-container">{children}</div>
      </IonContent>
      
      <Footer />
    </IonPage>
  );
};

export default AppLayout;