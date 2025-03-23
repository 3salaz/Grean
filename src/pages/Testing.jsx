import React from "react";
import {useProfile} from "../context/ProfileContext";
import {useLocations} from "../context/LocationsContext";
import {usePickups} from "../context/PickupsContext";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow
} from "@ionic/react";
import {useAuth} from "../context/AuthContext";

function Testing() {
  const {createProfile, updateProfile, deleteProfile} = useProfile();
  const {user} = useAuth();
  //   const {createLocation, updateLocation, deleteLocation} = useLocations();
  //   const {createPickup, updatePickup, deletePickup} = usePickups();
  console.log("Testing");
  const handleCreateProfile = async () => {
    try {
      await createProfile({
        displayName: user.displayName || "user",
        profilePic: user.photoURL || null,
        email: user.email || "",
        uid: user.uid,
        locations: [],
        pickups: [],
        accountType: "User"
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <IonPage>
      <IonContent scroll-y="false">
        <IonGrid>
          <IonRow class="ion-padding">
            <IonCol size="10">
              <h1>Testing</h1>
              <IonButton onClick={() => handleCreateProfile()}>
                Create Profile
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default Testing;
