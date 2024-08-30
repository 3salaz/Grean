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
  IonCard,
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
      driver: {
        displayName: "Erik Salazar",
        profilePic: "https://placeholder.com/200x200",
      },
      address: {
        locationType: "Business",
        street: "1249 Shafter",
        city: "San Francisco",
        state: "California",
      },
      isCompleted: true,
      date: "05-01-2024",
      aluminumWeight: 10,
      plasticWeight: 5,
    },
    {
      driver: {
        displayName: "Erik Salazar",
        profilePic: "https://placeholder.com/200x200",
      },
      address: {
        locationType: "Business",
        street: "1249 Shafter",
        city: "San Francisco",
        state: "California",
      },
      isCompleted: true,
      date: "05-01-2024",
      aluminumWeight: 10,
      plasticWeight: 5,
    },
    {
      driver: {
        displayName: "Erik Salazar",
        profilePic: "https://placeholder.com/200x200",
      },
      address: {
        locationType: "Business",
        street: "1249 Shafter",
        city: "San Francisco",
        state: "California",
      },
      isCompleted: true,
      date: "05-01-2024",
      aluminumWeight: 10,
      plasticWeight: 5,
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
    <IonContent id="stats">
      <IonGrid className="h-full p-0">
        <IonRow className="h-full">
          <IonCol size="12" className="h-full relative">
            <IonCard className="h-full relative m-0 bg-slate-800 text-white">
              <IonButton
                size="small"
                className="absolute z-20 top-2 left-2 shadow-xl"
              >
                <img className="w-8" src={userRoleInfo.icon} alt="User Icon" />
                <span className="text-sm">{userRoleInfo.text}</span>
              </IonButton>
              <div className="h-[60%] flex flex-col justify-center items-center">
                <IonRow className="w-full">
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
                    <div className="flex flex-col items-center">
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

                <IonRow className="w-full flex justify-center">
                  {["Savings", "Pickups", "Weight"].map((item, index) => (
                    <IonCol size="4" key={index} className="text-center">
                      <IonItem
                        lines="none"
                        className="border-2 border-white bg-green-500 px-2 w-full h-full flex items-center justify-center gap-4 flex-col p-2 rounded-lg shadow-md"
                      >
                        <IonLabel className="text-sm block">
                          <h1>
                            0<span className="font-bold text-sm">lbs</span>
                          </h1>
                          {item}
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  ))}
                </IonRow>
              </div>

              <IonCard className="h-[35%] relative">
                <IonButton
                  expand="block"
                  size="small"
                  className="font-bold absolute z-20 bottom-2 left-2"
                >
                  <IonIcon icon={arrowDownCircleOutline} size="large" />
                </IonButton>

                <IonRow color="primary" className="w-full h-full">
                  <IonCol className="text-right" size="3">
                    <IonText className="text-xl">Total</IonText>
                    <IonText className="font-bold text-grean text-2xl">
                      0
                    </IonText>
                    <IonText>lbs</IonText>
                  </IonCol>
                  <IonCol class="h-[50%]" size="12">
                    <hr className="text-white rounded-full" />
                  </IonCol>

                  <IonCol
                    size="12"
                    className="text-right flex-col flex items-center justify-center"
                  >
                    <IonText>0lbs of Aluminum</IonText>
                    <IonText>0lbs of Plastic</IonText>
                  </IonCol>
                </IonRow>
              </IonCard>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonRow className=" h-full p-0">
          <IonCol size="12" className="h-full drop-shadow-xl m-0 p-2">
            <IonCard className="h-full p-0 m-0">
              <IonItem className="md:rounded-md bg-white overflow-auto h-[90%]">
                <IonList className="w-full">
                  <IonListHeader className="text-xl text-grean font-bold text-center">
                    History | Current Week
                  </IonListHeader>
                  <IonItem className="border-gray-300 flex justify-between font-bold w-full">
                    <IonLabel>Driver</IonLabel>
                    <IonLabel>Weight</IonLabel>
                    <IonLabel>Date</IonLabel>
                  </IonItem>
                  {pickupHistory.map((pickup, index) => (
                    <IonItem
                      key={index}
                      className="border-slate-800 flex justify-between cursor-pointer w-full"
                      onClick={() => handlePickupClick(pickup)}
                    >
                      {/* <IonLabel></IonLabel> */}
                      <IonLabel>{pickup.date}</IonLabel>
                      <IonLabel>{pickup.aluminumWeight} lbs</IonLabel>
                      <IonLabel>{pickup.plasticWeight} lbs</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonItem>
              <IonSegment
                value={activeTab}
                className="h-[10%] bg-orange"
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
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonModal isOpen={modalOpen} onDidDismiss={closeModal}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="text-xl font-bold">Pickup Details</IonText>
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
