import PublicLayout from "@/app/layouts/PublicLayout";
import Landing from "@/features/public/pages/Landing";
import About from "@/features/public/pages/About";

const Home: React.FC = () => {
  return (
    <div
      className="snap-y snap-mandatory overflow-y-scroll h-full w-fullscrollbar-hide"
    >
      {/* LANDING */}
      <section
        id="landing"
        className="section h-screen flex justify-center items-center snap-start"
      >
        <Landing />
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="section h-screen flex justify-center items-center snap-start bg-[#103050]"
      >
        <About />
      </section>
    </div>
  );
};

export default Home;
