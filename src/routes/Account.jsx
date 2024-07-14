import ProfileTab from "../components/Layout/Tabs/ProfileTab";
import StatsTab from "../components/Layout/Tabs/StatsTab";
import MapTab from "../components/Layout/Tabs/MapTab";

function Account({ active }) {

  let ActiveComponent;
  switch (active) {
    case 0:
      ActiveComponent = ProfileTab;
      break;
    case 1:
      ActiveComponent = MapTab;
      break;
    case 2:
      ActiveComponent = StatsTab;
      break;
    default:
      ActiveComponent = null;
  }

  return (
    <section id="account" className="w-full h-full">
      {ActiveComponent ? <ActiveComponent /> : null}
    </section>
  );
}

export default Account;
