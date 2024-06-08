import ProfileTab from "../components/Layout/Tabs/ProfileTab";
import StatsTab from "../components/Layout/Tabs/StatsTab";
import MapTab from "../components/Layout/Tabs/MapTab";

function Account({ active }) {
  return (
    <section id="account" className="w-full h-full">
      {(() => {
        switch (active) {
          case 0:
            return <ProfileTab />;
          case 1:
            return <MapTab />;
          case 2:
            return <StatsTab />;
          default:
            return <></>;
        }
      })()}
    </section>
  );
}

export default Account;
