import { IonPage, IonContent } from "@ionic/react";
import Navbar from "@/app/layouts/Navbar";
import Footer from "@/app/layouts/Footer";
import { useEffect, useRef, useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [navbarHeight, setNavbarHeight] = useState(56);
  const [footerHeight, setFooterHeight] = useState(64);
  const navbarRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Measure navbar/footer dynamically so spacing adjusts automatically
  useEffect(() => {
    const nav = navbarRef.current;
    const foot = footerRef.current;

    if (nav) setNavbarHeight(nav.offsetHeight);
    if (foot) setFooterHeight(foot.offsetHeight);

    const handleResize = () => {
      if (nav) setNavbarHeight(nav.offsetHeight);
      if (foot) setFooterHeight(foot.offsetHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <IonPage id="client-layout" className="flex flex-col relative bg-gradient-to-t from-grean to-blue-300">
      {/* Fixed Navbar */}
      <div ref={navbarRef} className="z-50">
        <Navbar />
      </div>

      <IonContent
        scrollY
        className="relative z-0"
      >
        {children}
      </IonContent>

        <Footer />
    </IonPage>
  );
};

export default ClientLayout;
