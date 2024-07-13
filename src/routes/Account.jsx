import  { useEffect, useState } from "react";
import ProfileTab from "../components/Layout/Tabs/ProfileTab";
import StatsTab from "../components/Layout/Tabs/StatsTab";
import MapTab from "../components/Layout/Tabs/MapTab";
import { useAuthProfile } from "../context/AuthProfileContext";
import { useLocations } from "../context/LocationsContext";
import Setup from "./Setup";

function Account({ active }) {
  const { user, profile } = useAuthProfile();
  const { getUserAddresses } = useLocations();
  const [addresses, setAddresses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user || !user.uid) {
        console.error("User or UID is undefined");
        setError("User information is missing.");
        return;
      }

      try {
        const userAddresses = await getUserAddresses(user.uid);
        setAddresses(userAddresses);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user addresses:", err);
      }
    };

    fetchAddresses();
  }, [user, getUserAddresses]);

  if (!user) {
    return <div>Please sign in</div>; // Handle the case where the user is not authenticated
  }

  if (error) {
    return <div>Error: {error}</div>; // Handle errors during address fetch
  }

  if (addresses === null) {
    return <div>Loading...</div>; // Wait for addresses to be fetched
  }

  if (!profile || !profile.accountType) {
    return <Setup />; // Render Setup if profile or account type is not defined
  }

  if (profile.accountType === 'User' && addresses.length === 0) {
    return <Setup />; // Render Setup if account type is user and no addresses
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
