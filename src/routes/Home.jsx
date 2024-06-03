import Landing from "../components/Views/Landing";
import Contact from "../components/Views/Contact";
function Home() {
  return (
    <main className="h-[92svh] overflow-auto snap-y snap-mandatory hide-scroll overscroll-none w-full">
        <Landing />
        <Contact />
    </main>
  );
}

export default Home;
