import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { db } from "../../../../firebase";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
  IonFooter,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";

function Schedule({ handleClose }) {
  const { userAcceptedPickups } = usePickups();
  const { user } = useAuthProfile();
  const [formInputs, setFormInputs] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (userAcceptedPickups) {
      const initialFormStates = {};
      userAcceptedPickups.forEach((pickup) => {
        initialFormStates[pickup.id] = {
          aluminumWeight: "",
          plasticWeight: "",
          glassWeight: "",
          alcoholBottlesWeight: "",
        };
      });
      setFormInputs(initialFormStates);
    }
  }, [userAcceptedPickups]);

  const handleInputChange = (pickupId, name, value) => {
    setFormInputs((prev) => ({
      ...prev,
      [pickupId]: {
        ...prev[pickupId],
        [name]: value,
      },
    }));
  };

  function formatDateInfo(dateString) {
    if (!dateString) return { dayOfWeek: "", monthName: "", day: "", year: "" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { dayOfWeek: "Invalid Date", monthName: "", day: "", year: "" };
    }
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const formattedDate = formatter.formatToParts(date).reduce((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

    return {
      dayOfWeek: formattedDate.weekday,
      monthName: formattedDate.month,
      day: formattedDate.day,
      year: formattedDate.year,
    };
  }

  const handleSubmit = async (pickupId, e) => {
    e.preventDefault();

    const { aluminumWeight, plasticWeight, glassWeight, alcoholBottlesWeight } =
      formInputs[pickupId] || {};

    if (
      !aluminumWeight &&
      !plasticWeight &&
      !glassWeight &&
      !alcoholBottlesWeight
    ) {
      setError("Please enter weight for at least one type of material.");
      return;
    }

    setError("");

    try {
      const pickupDocRef = doc(db, `pickups`, pickupId);
      const pickupDoc = await getDoc(pickupDocRef);

      if (!pickupDoc.exists()) {
        setError("Pickup document does not exist.");
        console.error("Pickup document does not exist.");
        return;
      }

      await updateDoc(pickupDocRef, {
        aluminumWeight,
        plasticWeight,
        glassWeight,
        alcoholBottlesWeight,
        isCompleted: true,
      });

      setFormInputs((prev) => ({
        ...prev,
        [pickupId]: {
          aluminumWeight: "",
          plasticWeight: "",
          glassWeight: "",
          alcoholBottlesWeight: "",
        },
      }));

      handleClose();
    } catch (error) {
      console.error("Error completing pickup:", error);
      setError("Failed to complete the pickup. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Scheduled Pickups</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonList style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <IonListHeader>
                  <IonText>
                    <h2>
                      {userAcceptedPickups === null
                        ? "Loading..."
                        : `Accepted Pickups (${userAcceptedPickups.filter(
                            (pickup) => !pickup.isCompleted
                          ).length})`}
                    </h2>
                  </IonText>
                </IonListHeader>
                {userAcceptedPickups
                  .filter((pickup) => !pickup.isCompleted)
                  .map((pickup) => {
                    const { dayOfWeek, monthName, day, year } = formatDateInfo(
                      pickup.pickupDate
                    );

                    return (
                      <IonItem key={pickup.id} lines="full">
                        <IonGrid>
                          <IonRow>
                            <IonCol size="8">
                              <IonText color="primary">
                                <h3>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h3>
                              </IonText>
                              <IonText>{pickup.businessAddress}</IonText>
                              <IonText>{pickup.pickupNote}</IonText>
                            </IonCol>
                            <IonCol size="4" className="ion-text-right">
                              <IonText color="secondary">
                                <h2>{pickup.pickupTime}</h2>
                              </IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="12">
                              <form
                                onSubmit={(e) => handleSubmit(pickup.id, e)}
                              >
                                <IonGrid>
                                  <IonRow>
                                    <IonCol size="6">
                                      <IonItem>
                                        <IonLabel position="stacked">
                                          Aluminum (lbs)
                                        </IonLabel>
                                        <IonInput
                                          type="number"
                                          value={
                                            formInputs[pickup.id]
                                              ?.aluminumWeight || ""
                                          }
                                          onIonChange={(e) =>
                                            handleInputChange(
                                              pickup.id,
                                              "aluminumWeight",
                                              e.detail.value
                                            )
                                          }
                                        />
                                      </IonItem>
                                    </IonCol>
                                    <IonCol size="6">
                                      <IonItem>
                                        <IonLabel position="stacked">
                                          Plastic (lbs)
                                        </IonLabel>
                                        <IonInput
                                          type="number"
                                          value={
                                            formInputs[pickup.id]
                                              ?.plasticWeight || ""
                                          }
                                          onIonChange={(e) =>
                                            handleInputChange(
                                              pickup.id,
                                              "plasticWeight",
                                              e.detail.value
                                            )
                                          }
                                        />
                                      </IonItem>
                                    </IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol size="6">
                                      <IonItem>
                                        <IonLabel position="stacked">
                                          Glass (lbs)
                                        </IonLabel>
                                        <IonInput
                                          type="number"
                                          value={
                                            formInputs[pickup.id]
                                              ?.glassWeight || ""
                                          }
                                          onIonChange={(e) =>
                                            handleInputChange(
                                              pickup.id,
                                              "glassWeight",
                                              e.detail.value
                                            )
                                          }
                                        />
                                      </IonItem>
                                    </IonCol>
                                    <IonCol size="6">
                                      <IonItem>
                                        <IonLabel position="stacked">
                                          Alcohol Bottles (lbs)
                                        </IonLabel>
                                        <IonInput
                                          type="number"
                                          value={
                                            formInputs[pickup.id]
                                              ?.alcoholBottlesWeight || ""
                                          }
                                          onIonChange={(e) =>
                                            handleInputChange(
                                              pickup.id,
                                              "alcoholBottlesWeight",
                                              e.detail.value
                                            )
                                          }
                                        />
                                      </IonItem>
                                    </IonCol>
                                  </IonRow>
                                </IonGrid>
                                {error && (
                                  <IonText color="danger">
                                    <p>{error}</p>
                                  </IonText>
                                )}
                                <IonButton
                                  expand="block"
                                  type="submit"
                                  color="primary"
                                  className="ion-margin-top"
                                >
                                  Complete Pickup
                                </IonButton>
                              </form>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonItem>
                    );
                  })}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonButton
          color="danger"
          shape="round"
          fill="solid"
          onClick={handleClose}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            zIndex: 1000,
          }}
        >
          <IonIcon icon={closeOutline} size="large" />
        </IonButton>
      </IonFooter>
    </IonPage>
  );
}

export default Schedule;

