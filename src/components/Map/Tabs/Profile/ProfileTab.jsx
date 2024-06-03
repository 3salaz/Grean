import React, { useState, useEffect } from "react";
import ProfileHeader from "../../../UserHeader";
import { useProfile } from "../../../../context/ProfileContext";

// Modal Component
const Modal = ({ isOpen, onClose, pickup }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-4 rounded shadow-lg z-10">
        <h2 className="text-2xl font-bold mb-4">Pickup Details</h2>
        <div>Date: {pickup.date}</div>
        <div>Aluminum Weight: {pickup.aluminumWeight} lbs</div>
        <div>Plastic Weight: {pickup.plasticWeight} lbs</div>
        <div>Price: ${pickup.price}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// CircularProgress Component
const CircularProgress = ({ level, pounds, maxPounds }) => {
  // Calculate the progress percentage
  const progress = (pounds / maxPounds) * 100;

  // Calculate the stroke-dashoffset based on the progress
  const strokeDashoffset = 440 - (440 * progress) / 100;

  return (
    <div className="flex flex-col items-center justify-center text-white">
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
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold">Level {level}</h2>
      </div>
      <section className="text-center">
        Recycle 250 more pounds by December 31, 2024 to reach level 2
      </section>
    </div>
  );
};

const ProfileTab = () => {
  const [level, setLevel] = useState(1);
  const [pounds, setPounds] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // State to manage the active tab
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const maxPounds = 100; // Example max pounds for level up

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
    {
      date: "2024-04-20",
      aluminumWeight: 12,
      plasticWeight: 6,
      price: 18,
    },
    {
      date: "2024-04-20",
      aluminumWeight: 12,
      plasticWeight: 6,
      price: 18,
    },
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
    }, 1000);

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
  const { profile } = useProfile();

  // Determine user role and set appropriate icon and text
  const getUserRoleInfo = () => {
    switch (profile?.userRole) {
      case "Driver":
        return { icon: "car-outline", text: "Driver" };
      case "Home":
        return { icon: "home-outline", text: "Home" };
      case "Business":
        return { icon: "business-outline", text: "Business" };
      default:
        return { icon: "person-outline", text: "User" };
    }
  };

  const userRoleInfo = getUserRoleInfo();

  return (
      <main id="profileTab" className="w-full h-full z-20 flex flex-col items-center relative">
        <ProfileHeader />
        <div className="w-full container h-[89%] flex flex-col items-center justify-center gap-2 overflow-auto">
          <div className="bg-slate-800 w-full h-full p-4 flex flex-col gap-2 overflow-auto rounded-t-md">
          <div className="flex items-center gap-2 text-white text-center">
              <ion-icon name={userRoleInfo.icon} size="large"></ion-icon>
              <span>{userRoleInfo.text}</span>
            </div>
            <CircularProgress
              level={level}
              pounds={pounds}
              maxPounds={maxPounds}
            />
            <div className="w-full flex gap-2 items-center justify-center text-grean">
              <div className="border border-white px-2 basis-1/2 text-center">
                Aluminum %
              </div>
              <div className="border border-white px-2 basis-1/2 text-center">
                Plastic %
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
                        ? "border-b-transparent border-l-white border-r-white border-t-white"
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
            </div>
            <div className="w-full flex flex-col bg-white rounded-md">
              <div className="text-2xl text-grean font-bold w-full text-center p-2">
                History
              </div>
              <ul className="w-full text-center">
                <li className="border-b border-gray-300 px-4 flex justify-between font-bold">
                  <div>Date</div>
                  <div>Aluminum Weight</div>
                  <div>Plastic Weight</div>
                  <div>Price</div>
                </li>
                {pickupHistory.map((pickup, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-300 py-2 px-4 flex justify-between cursor-pointer"
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
          </div>
        </div>
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          pickup={selectedPickup}
        />
      </main>
  );
};

export default ProfileTab;
