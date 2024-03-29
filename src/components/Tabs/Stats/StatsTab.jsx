import ProfileHeader from "../../UserHeader";
import MainStats from "./MainStats";

function StatsTab() {

  return (
    <section
      id="statsTab"
      className="w-full h-[83svh] z-10 bg-white absolute top-0 flex items-center justify-center"
    >
      {/* Card */}
      <main className="container mx-auto md:pt-12 h-full flex items-center justify-center">
        <div className="w-full h-full z-20 flex flex-col items-center relative">
          <ProfileHeader />
          <div className="h-[85%] flex items-center justify-center px-2">
            <MainStats/>
          </div>
          
          <footer className="w-full flex justify-center items-center py-6">
                  <p className="text-black font-bold">
                    Learn More:{" "}
                    <a className="text-grean" href="https://grean.global">
                      Grean Global
                    </a>
                  </p>
          </footer>
        </div>
      </main>
    </section>
  );
}

export default StatsTab;
