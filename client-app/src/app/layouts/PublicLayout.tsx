import { IonPage, IonContent } from "@ionic/react";
import Navbar from "@/app/layouts/Navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <IonPage className="relative">
      {/* Navbar sits absolutely on top */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main scrollable content behind Navbar */}
      <IonContent
        fullscreen
        scrollY
        className="relative z-0 !pt-0 overflow-y-auto"
      >
        {children}
      </IonContent>
    </IonPage>
  );
};

export default PublicLayout;