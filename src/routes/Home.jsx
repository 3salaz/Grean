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
    <IonPage>
      <IonContent
        className="h-full overflow-auto snap-y snap-mandatory hide-scroll no-scroll overscroll-none w-full"
        scrollEvents={true}
      >
        <div className="section relative h-full w-full flex justify-center items-center snap-always snap-center">
          <Landing />
        </div>
        {/* <div className="section relative h-full w-full flex justify-center items-center snap-always snap-center">
          <Services />
        </div>
        <div className="section relative h-full w-full flex justify-center items-center snap-always snap-center">
          <Contact />
        </div> */}
      </IonContent>
    </IonPage>
  );
}

export default Home;