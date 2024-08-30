import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  IonPage,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonFooter,
} from "@ionic/react";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import dayjs from "dayjs";
import homeIcon from "../../../../assets/icons/home.png";
import { closeOutline } from "ionicons/icons";

function RequestPickup({ handleClose }) {
  const { createPickup } = usePickups();
  const { profile } = useAuthProfile();
  const [profileLocations, setProfileLocations] = useState([]);

  const initialFormData = useMemo(
    () => ({
      pickupDate: getCurrentDate(),
      pickupTime: "12:00",
      pickupNote: "",
      address: "",
      appliance: null,
    }),
    [profile]
  );

  const [pickupRequestData, setPickupRequestData] = useState(initialFormData);

  useEffect(() => {
    if (profile?.addresses) {
      setProfileLocations(profile.addresses);
    }
  }, [profile]);

  const handleChange = useCallback(
    (name, value) => {
      setPickupRequestData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "address") {
        const selectedAddress = profileLocations.find(
          (address) => address.street === value
        );

        if (selectedAddress) {
          console.log("Selected Address:", selectedAddress);
        } else {
          console.error("Selected address not found:", value);
        }
      }
    },
    [profileLocations]
  );

  const handleSubmit = async () => {
    const formDataWithFile = { ...pickupRequestData };

    const selectedAddress = profileLocations.find(
      (address) => address.street === pickupRequestData.address
    );

    if (!selectedAddress) {
      console.error("Selected address not found:", pickupRequestData.address);
      return;
    }

    const pickupData = {
      ...formDataWithFile,
      addressData: selectedAddress,
      longitude: selectedAddress.longitude,
      latitude: selectedAddress.latitude,
    };

    try {
      await createPickup(pickupData);
      handleClose();
    } catch (error) {
      console.error("Error creating pickup:", error);
    }
  };

  function getCurrentDate() {
    return dayjs().format("YYYY-MM-DD");
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <form
          className="flex flex-col gap-2 h-full justify-between items-center w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <header className="text-center w-full">
            <h1 className="text-xl font-bold text-grean">Request Pickup</h1>
            <p className="text-xs text-white font-bold bg-grean p-2 rounded">
              Schedule your next pickup!
            </p>
          </header>
          <main className="h-[85%] min-w-sm flex flex-col gap-2 overflow-auto">
            <IonItem className="w-full">
              <IonLabel position="stacked">Address</IonLabel>
              <IonSelect
                placeholder="Select your address"
                onIonChange={(e) => handleChange("address", e.detail.value)}
                value={pickupRequestData.address}
              >
                {profileLocations.map((address, index) => (
                  <IonSelectOption key={index} value={address.street}>
                    <div className="flex items-center gap-4">
                      <img className="w-6" src={homeIcon} alt="Home Icon" />
                      {address.street}
                    </div>
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {/* <IonItem className="w-full">
              <IonLabel position="stacked">Appliance</IonLabel>
              <IonSelect
                placeholder="Select appliance"
                onIonChange={(e) => handleChange("appliance", e.detail.value)}
                value={pickupRequestData.appliance}
              >
                <IonSelectOption value="washingMachine">
                  Washing Machine
                </IonSelectOption>
                <IonSelectOption value="refrigerator">
                  Refrigerator
                </IonSelectOption>
                <IonSelectOption value="oven">Oven</IonSelectOption>
                <IonSelectOption value="other">Other</IonSelectOption>
              </IonSelect>
            </IonItem> */}

            <IonItem className="mx-auto">
              <IonDatetime
                displayFormat="DD-MM-YYYY"
                min={dayjs().startOf("day").toISOString()}
                max={dayjs().add(7, "day").endOf("day").toISOString()}
                value={
                  pickupRequestData.pickupDate
                    ? `${pickupRequestData.pickupDate}T12:00:00Z`
                    : getCurrentDate()
                }
                onIonChange={(e) =>
                  handleChange(
                    "pickupDate",
                    dayjs(e.detail.value).isValid()
                      ? dayjs(e.detail.value).format("YYYY-MM-DD")
                      : getCurrentDate()
                  )
                }
              />
            </IonItem>

            <IonItem className="w-full">
              <IonLabel position="stacked">Pickup Notes</IonLabel>
              <IonTextarea
                rows={5}
                value={pickupRequestData.pickupNote}
                className="bg-slate-100 mt-2 pl-2 rounded-sm"
                onIonChange={(e) => handleChange("pickupNote", e.detail.value)}
              />
            </IonItem>
            <div className="flex justify-center items-center w-full">
              <IonButton expand="block" type="submit" color="primary" size="medium">
                Accept
              </IonButton>
            </div>
          </main>
          <IonFooter className="shadow-none">
              <IonButton
                color="danger"
                shape="round"
                size="large"
                fill="solid"
                onClick={handleClose}
                className="ion-margin-bottom flex items-center"
              >
                <IonIcon slot="icon-only" icon={closeOutline} size="large" />
              </IonButton>
          </IonFooter>
        </form>
      </IonContent>
    </IonPage>
  );
}

export default RequestPickup;
