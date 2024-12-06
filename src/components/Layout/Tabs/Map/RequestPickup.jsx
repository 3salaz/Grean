import {
  IonContent,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonPage,
  IonList,
  IonDatetime,
  IonCheckbox,
} from "@ionic/react";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import dayjs from "dayjs";
import homeIcon from "../../../../assets/icons/home.png";
import { closeOutline } from "ionicons/icons";
import {
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../../../firebase";

function RequestPickup({ handleClose }) {
  const { createPickup } = usePickups();
  const { profile, updateProfileData } = useAuthProfile();
  const [profileLocations, setProfileLocations] = useState([]);

  const initialFormData = useMemo(
    () => ({
      pickupDateTime: dayjs().toISOString(), // Default to current date and time
      pickupNote: "",
    }),
    [profile]
  );

  const [pickupRequestData, setPickupRequestData] = useState(initialFormData);

  useEffect(() => {
    if (profile?.addresses) {
      setProfileLocations(profile.addresses);
    }
  }, [profile]);

  const handleChange = useCallback((name, value) => {
    setPickupRequestData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Build the pickup data with materials included

  const handleSubmit = async () => {
    try {
      // Query for active pickups of the current user (pickups that are not completed or deleted)
      const pickupsRef = collection(db, "pickups"); // Reference to the "pickups" collection
      const activePickupsQuery = query(
        pickupsRef,
        where("createdBy.userId", "==", profile?.uid),
        where("isCompleted", "==", false)
      );

      const querySnapshot = await getDocs(activePickupsQuery);

      // Restrict to only 2 active pickups at a time
      if (querySnapshot.docs.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Proceed to create the new pickup if under the limit
      const selectedAddress = profileLocations.find(
        (address) => address.street === pickupRequestData.address
      );

      if (!selectedAddress) {
        toast.error("Please select a valid address.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      if (!pickupRequestData.pickupDateTime) {
        toast.error("Please select a valid pickup date and time.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Build the pickup data with materials included
      const pickupData = {
        pickupDate: dayjs(pickupRequestData.pickupDateTime).format(
          "YYYY-MM-DD"
        ),
        pickupTime: dayjs(pickupRequestData.pickupDateTime).format("HH:mm"),
        pickupNote: pickupRequestData.pickupNote || "", // Set default empty note
        addressData: selectedAddress,
        isAccepted: false,
        isCompleted: false,
        materials: { ...materials }, // Include the materials object
        createdBy: {
          displayName: profile?.displayName || "No Name",
          photoURL: profile?.profilePic || "",
          userId: profile?.uid,
          email: profile?.email,
        },
      };

      const newPickupId = await createPickup(pickupData);

      if (newPickupId) {
        await updateProfileData(profile?.uid, {
          pickups: arrayUnion(newPickupId),
        });
        toast.success("Pickup request created successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        handleClose(); // Close the modal on success
      }
    } catch (error) {
      console.error("Error creating pickup or checking active pickups:", error);
      toast.error("There was an error creating the pickup. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Define available materials
  const [materials, setMaterials] = useState({
    plastic: false,
    glass: false,
    aluminum: false,
  });

  // Handle material selection
  const handleMaterialChange = (material) => {
    setMaterials((prevState) => ({
      ...prevState,
      [material]: !prevState[material],
    }));
  };

  return (


      <IonContent className="ion-no-padding" color="light">
        <ToastContainer
          position="top-right"
          className="top-50"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <IonGrid className="h-full">
          <IonList className="h-full justify-between items-center w-full">
            <IonRow className="flex-grow max-h-[85svh] overflow-y-auto w-full">
              <IonCol size="12" className="text-center mx-auto rounded-xl">
                <IonItem
                  color="light"
                  lines="none"
                  className="w-full px-2 rounded-xl"
                >
                  {/* <IonLabel color="secondary" position="stacked" className="w-full">
                    Address
                  </IonLabel> */}
                  <IonSelect
                    className="ion-align-self-center w-full"
                    placeholder="Select your address"
                    onIonChange={(e) => handleChange("address", e.detail.value)}
                    value={pickupRequestData.address}
                  >
                    {profileLocations.map((address, index) => (
                      <IonSelectOption key={index} value={address.street}>
                        <div className="flex items-center gap-4">
                          <img
                            className="w-10"
                            src={homeIcon}
                            alt="Home Icon"
                          />
                          {address.street}
                        </div>
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>

              <IonCol size="12">
                {/* Single IonDatetime for both Date and Time */}
                <IonItem lines="none" className="w-full">
                  <IonLabel className="mx-auto w-full" position="stacked">
                    Pickup Date & Time
                  </IonLabel>
                  <IonDatetime
                    presentation="date-time"
                    value={pickupRequestData.pickupDateTime}
                    className="mx-auto rounded-lg"
                    onIonChange={(e) =>
                      handleChange("pickupDateTime", e.detail.value)
                    }
                    placeholder="Select Date and Time"
                    min={dayjs().toISOString()} // Restrict to future date and time
                    minuteValues="0,15,30,45" // Only allow 30-minute intervals
                  />
                </IonItem>
              </IonCol>

              <IonCol size="12" className="">
                <IonItem lines="none" className="w-full p-0 m-0">
                  <IonLabel
                    className=" w-full rounded-lg text-center p-1"
                    position="stacked"
                  >
                    Type of material
                  </IonLabel>
                  <IonList className="flex flex-wrap w-full max-w-lg p-2">
                    {Object.keys(materials).map((material, index) => (
                      <IonItem
                        lines="none"
                        className="w-full basis-1/2"
                        key={index}
                      >
                        <IonLabel className="w-full">
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                        </IonLabel>
                        <IonCheckbox
                          alignment="center"
                          justify="end"
                          checked={materials[material]}
                          onIonChange={() => handleMaterialChange(material)}
                        />
                      </IonItem>
                    ))}
                  </IonList>
                </IonItem>
              </IonCol>

              <IonCol size="12">
                <IonItem lines="none" className="w-full">
                  <IonLabel
                    className=" w-full rounded-lg text-center"
                    position="stacked"
                  >
                    Pickup Notes
                  </IonLabel>
                  <IonTextarea
                    rows={3}
                    value={pickupRequestData.pickupNote}
                    className="bg-slate-50 rounded-md p-1"
                    onIonChange={(e) =>
                      handleChange("pickupNote", e.detail.value)
                    }
                  />
                </IonItem>
              </IonCol>

              <IonCol
                size="12"
                className="flex justify-center items-center w-full gap-2"
              >
                {/* Trigger handleSubmit on button click */}
                <IonButton
                  color="primary"
                  expand="block"
                  className="w-full max-w-sm"
                  onClick={handleSubmit}
                >
                  Submit
                </IonButton>
              </IonCol>
            </IonRow>
          </IonList>
        </IonGrid>
        <IonFooter>
        <IonToolbar color="primary">
          <IonRow className="ion-justify-content-center p-0 m-0">
            <IonCol size="auto" className="p-0 m-0">
              <IonButton
                color="danger"
                shape="round"
                size="large"
                fill="solid"
                onClick={handleClose}
              >
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
      </IonContent>


  );
}

export default RequestPickup;
