import { useEffect, useRef } from "react";
import { IonPage, IonContent } from "@ionic/react";
import Landing from "../components/Layout/Views/Landing";
// import Contact from "../components/Layout/Views/Contact";
// import Services from "../components/Layout/Views/Services";

function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sectionElements = document.querySelectorAll(".section");
    sectionsRef.current = Array.from(sectionElements);
  }, []);

  return (
    <IonContent>
        <div className="relative h-full w-full flex justify-center items-center snap-always snap-center">
          <Landing />
        </div>
      </IonContent>
  );
}

export default Home;