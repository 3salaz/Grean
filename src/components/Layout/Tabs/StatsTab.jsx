import { useEffect, useState } from 'react';
import UserHeader from '../../Common/UserHeader';
import { useAuthProfile } from '../../../context/AuthProfileContext';
import { useLocations } from '../../../context/LocationsContext';

function StatsTab() {
  const { user, profile } = useAuthProfile();
  const { fetchLocations } = useLocations();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetchLocations(user.uid)
  }, [user]);

  

  return (
    <main
      id="statsTab"
      className="w-full h-full bg-light-gray z-20 flex flex-col items-center relative p-6"
    >
      <div className="w-full h-full flex flex-col justify-between gap-4">
        <UserHeader />
        <div
          id="locationInfo"
          className="h-[70%] w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none"
        >
          {/* {addresses.map((address, index) => (
            <div
              key={index}
              className="section flex-none w-full h-full flex justify-center items-center snap-center bg-blue-100"
            >
              ({address.street}, {address.city}, {address.state} || "LOCATION")
            </div>
          ))} */}
        </div>

        <div className="flex justify-between items-center gap-2 h-[20%]">
          <div className="rounded-md basis-3/6 aspect-[8/2] flex items-center justify-center bg-white">
            <div className="text-lg">Location 1</div>
          </div>
          <div className="aspect-square rounded-md bg-grean text-white flex flex-col items-center justify-center p-1">
            <ion-icon size="large" name="add-circle-outline"></ion-icon>
            <div className="text-xs p-1">{""}</div>
          </div>
          <div className="aspect-square bg-white rounded-md">Hello</div>
        </div>
      </div>
    </main>
  );
}

export default StatsTab;
