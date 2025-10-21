import { IonPage, IonContent } from "@ionic/react";
import Footer from "@/app/layouts/Footer";
import Navbar from "@/app/layouts/Navbar";
import { useEffect, useRef, useState } from "react";

interface DriverLayoutProps {
  children: React.ReactNode;
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ children }) => {
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
    <IonPage id="driver-layout" className="flex flex-col relative bg-gradient-to-t from-grean to-green-500">
        <Navbar />

      <IonContent
        scrollY
      >
        {children}
      </IonContent>

      {/* Fixed Footer */}
        <Footer />
    </IonPage>
  );
};

export default DriverLayout;
