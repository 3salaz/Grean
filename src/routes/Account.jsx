import React, { useEffect, useState } from "react";
import Profile from "../components/Layout/Tabs/Profile";
import Stats from "../components/Layout/Tabs/Stats";
import Map from "../components/Layout/Tabs/Map";
import CreateAccountType from "../components/Common/CreateAccountType";
import SlideInModal from "../components/Layout/Modals/SlideInModal";
import { useAuthProfile } from "../context/AuthProfileContext";

function Account({ active }) {
  const { profile } = useAuthProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (profile && !profile.accountType) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [profile]);

  let ActiveTab;
  switch (active) {
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
    <section id="account" className="w-full h-full">
      <SlideInModal isOpen={isModalOpen} handleClose={handleCloseModal} showCloseButton={false}>
        <CreateAccountType handleClose={handleCloseModal} />
      </SlideInModal>
      {profile && profile.accountType && ActiveTab && <ActiveTab />}
    </section>
  );
}

export default Account;
