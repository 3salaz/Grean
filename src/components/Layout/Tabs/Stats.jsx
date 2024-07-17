import { useState, useEffect } from "react";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import userIcon from "../../../assets/icons/user.png";
import Button from "../Button";
import SpringModal from "../Modals/SpringModal"; // Import the SpringModal component

const Stats = () => {
  const [level, setLevel] = useState(1);
  const [pounds, setPounds] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // State to manage the active tab
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const maxPounds = 100; // Example max pounds for level up
  const progress = (pounds / maxPounds) * 100;
  const { profile } = useAuthProfile();

  // Calculate the stroke-dashoffset based on the progress
  const strokeDashoffset = 440 - (440 * progress) / 100;

  // Example template data for pickup history
  const pickupHistory = [
    {
      date: "2024-05-01",
      aluminumWeight: 10,
      plasticWeight: 5,
      price: 15,
    },
    {
      date: "2024-04-25",
      aluminumWeight: 8,
      plasticWeight: 7,
      price: 14,
    },
    {
      date: "2024-04-20",
      aluminumWeight: 12,
      plasticWeight: 6,
      price: 18,
    },
    // Additional data...
  ];

  // Example effect to update pounds and level (you can replace this with your actual logic)
  useEffect(() => {
    const interval = setInterval(() => {
      setPounds((prevPounds) => {
        const newPounds = prevPounds + 5;
        if (newPounds >= maxPounds) {
          setLevel((prevLevel) => prevLevel + 1);
          return 0; // Reset pounds after reaching max
        }
        return newPounds;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [maxPounds]);

  const handlePickupClick = (pickup) => {
    setSelectedPickup(pickup);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPickup(null);
  };

  // Determine user role and set appropriate icon and text
  const getUserRoleInfo = () => {
    switch (profile?.accountType) {
      case "Driver":
        return { icon: "car-outline", text: "Driver" };
      case "User":
        return { icon: userIcon, text: "User" };
      default:
        return { icon: "person-outline", text: "null" };
    }
  };

  const userRoleInfo = getUserRoleInfo();
  // const adresses = profile.locations.addresses
  // console.log( adresses.length)
  return (
    <main
      id="StatsTab"
      className="w-full h-full z-20 flex flex-col items-center justify-center relative pb-4"
    >
      <div className="w-full h-full overflow-auto snap-y snap-mandatory hide-scroll no-scroll overscroll-none text-white">
        <div
          id="stats"
          className="w-full h-full bg-slate-800 border-b-white border-b-2 mx-auto container section relative justify-center items-center snap-always snap-center p-4 flex flex-col gap-2"
        >
          <div className="h-full max-w-lg flex flex-col gap-2">
            <div className="w-full">
              <div className="flex justify-left items-center gap-2 text-center rounded-md drop-shadow-xl absolute">
                <div className="bg-grean pr-2 flex items-center justify-center rounded-md">
                  <img
                    className="w-10"
                    src={userRoleInfo.icon}
                    alt="User Icon"
                  ></img>
                  <span>{userRoleInfo.text}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-center justify-center text-white">
                <svg
                  className="w-32 h-32 text-white"
                  viewBox="0 0 160 160"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="circle-bg"
                    cx="80"
                    cy="80"
                    r="70"
                    strokeWidth="10"
                    stroke="#e6e6e6"
                    fill="none"
                  />
                  <circle
                    className="circle-progress"
                    cx="80"
                    cy="80"
                    r="70"
                    strokeWidth="10"
                    stroke="#4caf50"
                    fill="none"
                    strokeDasharray="440"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                  <text
                    className="circle-text"
                    x="50%"
                    y="50%"
                    dy=".3em"
                    textAnchor="middle"
                    fontSize="20"
                    fill="#fff"
                  >
                    {pounds} lbs
                  </text>
                </svg>

                <div className="text-center">
                  <h2 className="text-2xl font-bold">Level {level}</h2>
                  <h3 className="text-xl font-bold">{profile.displayName}</h3>
                </div>
                <section className="text-center">
                  Recycle 250 more pounds by December 31, 2024 to reach level 2
                </section>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full h-full flex gap-2 items-center justify-between text-white">
                <div className="border-2 border-white bg-grean px-2 basis-1/3 h-full text-center flex items-center justify-center gap-4 flex-col p-2 rounded-lg shadow-md">
                  <div className="text-sm">Aluminum</div>
                  <div className="text-4xl font-bold">
                    0<span className="font-bold text-sm">lbs</span>
                  </div>
                </div>
                <div className="border-2 border-white bg-grean px-2 basis-1/3 h-full text-center flex items-center justify-center gap-4 flex-col p-2 rounded-lg shadow-md">
                  <div className="text-sm">Plastic</div>
                  <div className="text-4xl font-bold">
                    0<span className="font-bold text-sm">lbs</span>
                  </div>
                </div>
                <div className="border-2 border-white bg-grean px-2 basis-1/3 h-full text-center flex items-center justify-center gap-4 flex-col p-2 rounded-lg shadow-md">
                  <div className="text-sm">Glass</div>
                  <div className="text-4xl font-bold">
                    0<span className="font-bold text-sm">lbs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              <ul className="flex items-center justify-center text-white text-center">
                {["Weekly", "Monthly", "Yearly"].map((tab, index) => (
                  <li
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`cursor-pointer border-solid border px-2 pt-1 basis-1/3 ${
                      activeTab === index
                        ? "border-b-transparent border-l-white border-r-white border-t-white rounded-t-md bg-grean"
                        : "border-b-white border-l-transparent border-r-transparent border-t-transparent"
                    }`}
                  >
                    {tab}
                  </li>
                ))}
              </ul>
              <div className="w-full flex items-center justify-center gap-2 text-white relative h-20 py-4">
                <div className="text-right">
                  <div className="text-xl">Total</div>
                  <div className="font-bold text-grean text-2xl">0</div>
                  <div>lbs</div>
                </div>
                <div className="w-[10%]">
                  <hr className="text-white rounded-full" />
                </div>
                <div className="border-white border border-r-transparent rounded-l-md w-[30%] h-full flex flex-col justify-between"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>0lbs of Aluminum</div>
                  <div>0lbs of Plastic</div>
                </div>
              </div>
              <div id="slideDown" className="flex bottom-2 left-2">
                <Button className="bg-white font-bold text-grean w-auto">
                  <ion-icon
                    size="large"
                    className="font-bold object-fit"
                    name="arrow-down-circle-outline"
                  ></ion-icon>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="history"
          className="w-full section relative h-full justify-center items-center snap-always snap-center flex flex-col bg-orange text-slate-800 overflow-auto"
        >
          <div className="h-full container mx-auto pb-4">
            <section
              id=""
              className="flex flex-col md:flex-row gap-2 h-full w-full md:p-8"
            >
              <div
                id="historySection"
                className="md:rounded-md shadow-lg basis-2/3 bg-white overflow-auto"
              >
                <div className="text-xl text-grean font-bold w-full text-center p-5">
                  History
                </div>
                <div className="border-b border-gray-300 px-4 flex justify-between font-bold">
                  <div>Date</div>
                  <div>Aluminum Weight</div>
                  <div>Plastic Weight</div>
                  <div>Price</div>
                </div>
                <ul className="w-full text-center">
                  {pickupHistory.map((pickup, index) => (
                    <li
                      key={index}
                      className="border-b border-slate-800 py-2 px-4 flex justify-between cursor-pointers"
                      onClick={() => handlePickupClick(pickup)}
                    >
                      <div>{pickup.date}</div>
                      <div>{pickup.aluminumWeight} lbs</div>
                      <div>{pickup.plasticWeight} lbs</div>
                      <div>${pickup.price}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div id="otherSection" className="md:rounded-md basis-1/3">
                <div className="h-full w-full rounded-lg flex md:flex-col items-center gap-2 p-2">
                  <div className="flex bg-white aspect-square basis-1/2 rounded-md shadow-lg"></div>
                  <div className="basis-1/2 flex items-center justify-center aspect-square shadow-lg">
                    <div className="bg-white aspect-square w-full p-2 rounded-md"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <SpringModal isOpen={modalOpen} handleClose={closeModal}>
        <div className="w-full flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Pickup Details</h2>
          {selectedPickup ? (
            <>
              <div>Date: {selectedPickup.date}</div>
              <div>Aluminum Weight: {selectedPickup.aluminumWeight} lbs</div>
              <div>Plastic Weight: {selectedPickup.plasticWeight} lbs</div>
              <div>Price: ${selectedPickup.price}</div>
            </>
          ) : (
            <>No Pickups</>
          )}

          <Button size="large" variant="primary">
            Toggle
          </Button>
        </div>
      </SpringModal>
    </main>
  );
};

export default Stats;
