import React, { useEffect, useState } from "react";
import Profile from "../components/Layout/Tabs/Profile";
import Stats from "../components/Layout/Tabs/Stats";
import Map from "../components/Layout/Tabs/Map";
import CreateProfile from "../components/Common/CreateProfile";
import SlideInModal from "../components/Layout/Modals/SlideInModal";
import { useAuthProfile } from "../context/AuthProfileContext";
import TabBar from "../components/Layout/TabBar";

function Account() {
  const { profile } = useAuthProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  let ActiveTab;

  useEffect(() => {
    if (
      profile && (
        !profile.accountType || 
        profile.accountType === "" ||
        !profile.displayName || 
        profile.displayName === "" ||
        !profile.profilePic || 
        profile.profilePic === ""
      )
    ) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [profile]);

  switch (activeTab) {
    case 0:
      ActiveTab = Profile;
      break;
    case 1:
      ActiveTab = Map;
      break;
    case 2:
      ActiveTab = Stats;
      break;
    default:
      ActiveTab = null;
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="account" className="w-full h-[82svh]">
      <SlideInModal isOpen={isModalOpen} handleClose={handleCloseModal} showCloseButton={false}>
        <CreateProfile handleClose={handleCloseModal} />
      </SlideInModal>
      {profile && profile.accountType && ActiveTab && <ActiveTab />}
      <TabBar active={activeTab} setActive={setActiveTab} />
    </section>
  );
}

export default Account;
