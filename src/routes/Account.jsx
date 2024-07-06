import ProfileTab from "../components/Layout/Tabs/ProfileTab";
import StatsTab from "../components/Layout/Tabs/StatsTab";
import MapTab from "../components/Layout/Tabs/MapTab";
import { useAuthProfile } from "../context/AuthProfileContext";
import Setup from "./Setup";

function Account({ active }) {
  const { user, profile } = useAuthProfile();

  if (!user) {
    return <div>Please sign in</div>; // Handle the case where the user is not authenticated
  }
  if (!profile || !profile.userRole) {
    return <Setup/> // Render MultiStepForm if profile is not defined or role is not defined
  }

  let ActiveComponent;
  
  switch (active) {
    case 0:
      ActiveComponent = StatsTab;
      break;
    case 1:
      ActiveComponent = MapTab;
      break;
    case 2:
      ActiveComponent = ProfileTab;
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

