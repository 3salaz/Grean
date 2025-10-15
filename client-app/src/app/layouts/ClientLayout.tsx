import { IonPage, IonContent } from "@ionic/react";
import Footer from "@/app/layouts/Footer"; // your IonTabs/footer bar
import Navbar from "./Navbar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <IonPage>
      {/* Main content */}
      <Navbar />
      <IonContent fullscreen className="ion-padding">
        {children}
      </IonContent>

      {/* Tab bar / bottom nav */}
      <Footer />
    </IonPage>
  );
};

export default ClientLayout;