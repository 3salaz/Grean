import ProfileHeader from "../../../Common/UserHeader";
import MainStats from "./MainStats";

function StatsTab() {
  return (
    <main
      id="statsTab"
      className="w-full h-full z-20 flex flex-col items-center relative"
    >
      <ProfileHeader />  
       
      <section className="h-[85%] flex items-center justify-center px-2 bg-grean w-full rounded-t-md">
        <MainStats />
      </section>

      <footer className="w-full flex justify-center items-center py-6">
        <p className="text-black font-bold">
          Learn More:{" "}
          <a className="text-grean" href="https://grean.global">
            Grean Global
          </a>
        </p>
      </footer>
    </main>
  );
}

export default StatsTab;
