import { useState, useEffect } from "react";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonIcon,
  IonList,
  IonListHeader,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { arrowDownCircleOutline, personOutline } from "ionicons/icons";
import userIcon from "../../../../assets/icons/user.png";
import driverIcon from "../../../../assets/icons/driver.png";

const Stats = () => {
  const [level, setLevel] = useState(1);
  const [pounds, setPounds] = useState(0);
  const [activeTab, setActiveTab] = useState("weekly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const maxPounds = 100;
  const progress = (pounds / maxPounds) * 100;
  const { profile } = useAuthProfile();

  const pickupHistory = [
    {
      date: "2024-05-01",
      aluminumWeight: 10,
      plasticWeight: 5,
    },
    {
      date: "2024-04-25",
      aluminumWeight: 8,
      plasticWeight: 7,
    },
    {
      date: "2024-04-20",
      aluminumWeight: 12,
      plasticWeight: 6,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPounds((prevPounds) => {
        const newPounds = prevPounds + 5;
        if (newPounds >= maxPounds) {
          setLevel((prevLevel) => prevLevel + 1);
          return 0;
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

  const getUserRoleInfo = () => {
    switch (profile?.accountType) {
      case "Driver":
        return { icon: driverIcon, text: "Driver" };
      case "User":
        return { icon: userIcon, text: "User" };
      default:
        return { icon: personOutline, text: "null" };
    }
  };

  const userRoleInfo = getUserRoleInfo();

  return (
    <IonContent id="stats" class="bg-slate-800 w-full">
      <IonGrid className="h-full container">
        <IonRow className="h-full position-relative">
          <IonCol size="12" className="position-relative bg-white">
            {/* Profile Type */}
            <IonButton size="small" className="absolute z-20 top-0 left-0">
            <img className="w-10" src={userRoleInfo.icon} alt="User Icon" />
            <span className="text-sm">{userRoleInfo.text}</span>
          </IonButton>

          <IonButton
            expand="block"
            className="font-bold text-grean absolute z-20 bottom-4 left-4"
          >
            <IonIcon icon={arrowDownCircleOutline} size="large" />
          </IonButton>
            {/*  */}
            <IonGrid className="h-full w-full ">
              <IonRow className="h-full flex flex-col justify-between">
                <IonRow class="h-30%">
                  <IonCol
                    size="12"
                    className="text-center flex flex-col w-full items-center justify-center"
                  >
                    <svg
                      className="w-32 h-32"
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
                        strokeDashoffset={440 - (440 * progress) / 100}
                        strokeLinecap="round"
                      />
                      <text
                        className="circle-text"
                        x="50%"
                        y="50%"
                        dy=".3em"
                        textAnchor="middle"
                        fontSize="25"
                        fill="#75b657"
                      >
                        {pounds} lbs
                      </text>
                    </svg>
                    <div className="flex flex-col">
                      <IonText className="text-2xl font-bold">
                        Level : {level}
                      </IonText>
                      <IonText className="text-xl font-bold">
                        {profile.displayName}
                      </IonText>
                      <IonText className="text-center">
                        Recycle 250 more pounds by December 31, 2024 to reach
                        level 2
                      </IonText>
                    </div>
                  </IonCol>
                </IonRow>

                <IonRow className="h-[20%] justify-content-center align-items-center w-full">
                  {["Aluminum", "Plastic", "Glass"].map((item, index) => (
                    <IonCol size="4" key={index} className="text-center">
                      <IonItem
                        lines="none"
                        className="border-2 border-white bg-grean px-2 w-full h-full text-center flex items-center justify-center gap-4 flex-col p-2 rounded-lg shadow-md"
                      >
                        <IonLabel className="text-sm block">{item}</IonLabel>
                        <IonText className="text-xl font-bold">
                          0<span className="font-bold text-sm">lbs</span>
                        </IonText>
                      </IonItem>
                    </IonCol>
                  ))}
                </IonRow>
                <IonRow className="h-[40%] text-white bg-slate-800 w-full">
                <IonCol className="text-right">
                  <IonText className="text-xl">Total</IonText>
                  <IonText className="font-bold text-grean text-2xl">0</IonText>
                  <IonText>lbs</IonText>
                </IonCol>
                <IonCol size="10">
                  <hr className="text-white rounded-full" />
                </IonCol>
                <IonCol>
                  <IonText>0lbs of Aluminum</IonText>
                  <IonText>0lbs of Plastic</IonText>
                </IonCol>
              </IonRow>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>

        <IonRow className="h-full">
          <IonCol size="12" class="h-full">
            <IonGrid className="h-full">
              <IonRow className="h-[92%]">
                <IonCol size="12" className="h-full drop-shadow-xl">
                  <IonItem className="md:rounded-md bg-white overflow-auto h-full">
                    <IonList class="w-full">
                      <IonListHeader className="text-xl text-grean font-bold w-full text-center p-5">
                        History | Current Week
                      </IonListHeader>
                      <IonItem
                        className="border-b border-gray-300 px-4 flex justify-between font-bold"
                      >
                        <IonLabel>Date</IonLabel>
                        <IonLabel>Aluminum Weight</IonLabel>
                        <IonLabel>Plastic Weight</IonLabel>
                      </IonItem>
                      {pickupHistory.map((pickup, index) => (
                        <IonItem
                          key={index}
                          className="border-b border-slate-800 py-2 px-4 flex justify-between cursor-pointer"
                          onClick={() => handlePickupClick(pickup)}
                        >
                          <IonLabel>{pickup.date}</IonLabel>
                          <IonLabel>{pickup.aluminumWeight} lbs</IonLabel>
                          <IonLabel>{pickup.plasticWeight} lbs</IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonItem>
                </IonCol>
                {/* <IonCol size="12">
                  <div className="h-full w-full rounded-lg flex md:flex-col justify-center items-center gap-2">
                    <IonButton expand="block" color="primary" shape="round">
                      Action 1
                    </IonButton>
                    <IonButton expand="block" color="primary" shape="round">
                      Action 2
                    </IonButton>
                  </div>
                </IonCol> */}
              </IonRow>
              <IonRow class="h-[8%]">
                <IonCol size="12" className="bg-blue-400">
                  <IonSegment
                    value={activeTab}
                    className="h-full"
                    onIonChange={(e) => setActiveTab(e.detail.value)}
                  >
                    <IonSegmentButton value="weekly">
                      <IonLabel>Weekly</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="monthly">
                      <IonLabel>Monthly</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="yearly">
                      <IonLabel>Yearly</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonModal isOpen={modalOpen} onDidDismiss={closeModal}>
        <IonGrid className="w-full">
          <IonRow className="w-full">
            <IonCol>
              <IonText className="text-2xl font-bold">Pickup Details</IonText>
              {selectedPickup ? (
                <>
                  <IonText>Date: {selectedPickup.date}</IonText>
                  <IonText>
                    Aluminum Weight: {selectedPickup.aluminumWeight} lbs
                  </IonText>
                  <IonText>
                    Plastic Weight: {selectedPickup.plasticWeight} lbs
                  </IonText>
                </>
              ) : (
                <IonText>No Pickups</IonText>
              )}
            </IonCol>
          </IonRow>
          <IonRow className="w-full">
            <IonCol>
              <IonButton expand="block" color="primary" onClick={closeModal}>
                Close
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonModal>
    </IonContent>
  );
};

export default Stats;
