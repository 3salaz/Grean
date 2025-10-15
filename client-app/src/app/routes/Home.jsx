import { useEffect, useRef } from "react";
import { IonPage, IonContent } from "@ionic/react";
import Landing from "@/features/marketing/pages/Landing";

function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sectionElements = document.querySelectorAll(".section");
    sectionsRef.current = Array.from(sectionElements);
  }, []);

  return (
        <div className="relative h-full w-full flex justify-center items-center snap-always snap-center">
          <Landing />
        </div>
  );
}

export default Home;