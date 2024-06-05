import React, { useEffect, useRef, useState } from "react";
import Landing from "../components/Layout/Views/Landing";
import Contact from "../components/Layout/Views/Contact";
import Services from "../components/Layout/Views/Services";
import PaginationBubbles from "../components/Common/PaginationBubbles";

function Home() {
  const sectionsRef = useRef([]);
  const [activeSection, setActiveSection] = useState(0);

  const handleScroll = () => {
    const offset = window.innerHeight / 2; // Adjust the offset as needed
    const sectionPositions = sectionsRef.current.map(
      (section) => section.getBoundingClientRect().top
    );
    const activeIndex = sectionPositions.findIndex((pos) => pos > -offset && pos < offset);
    setActiveSection(activeIndex !== -1 ? activeIndex : sectionsRef.current.length - 1);
  };

  useEffect(() => {
    const sectionElements = document.querySelectorAll('.section');
    sectionsRef.current = Array.from(sectionElements);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="h-[92svh] overflow-auto snap-y snap-mandatory hide-scroll no-scroll overscroll-none w-full">
      <div className="section relative h-full w-full flex justify-center items-center snap-always snap-center"><Landing/></div>
      <div className="section relative h-full w-full flex justify-center items-center snap-always snap-center"><Services/></div>
      <div className="section relative h-full w-full flex justify-center items-center snap-always snap-center"><Contact/></div>
      <PaginationBubbles sections={sectionsRef.current} activeSection={activeSection} />
    </section>
  );
}

export default Home;

