import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { usePickups } from "../../../../context/PickupsContext";
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
  IonAccordionGroup,
  IonAccordion,
  IonButtons,
  IonCard,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useAuthProfile } from "../../../../context/AuthProfileContext";

function Schedule({ handleClose }) {
  const { userAcceptedPickups } = usePickups(); // Get accepted pickups
  const [formInputs, setFormInputs] = useState({});
  const [error, setError] = useState("");
  const { user, updateProfileData } = useAuthProfile();
  const { profile } = useAuthProfile();

  // Filter only accepted but not yet completed pickups
  // Memoize the filtered pickups to prevent unnecessary recalculations
  const filteredPickups = useMemo(() => {
    return userAcceptedPickups?.filter((pickup) => !pickup.isCompleted) || [];
  }, [userAcceptedPickups]);

  useEffect(() => {
    if (filteredPickups.length > 0) {
      const initialFormStates = {};
      filteredPickups.forEach((pickup) => {
        initialFormStates[pickup.id] = {
          aluminumWeight: "",
          plasticWeight: "",
          glassWeight: "",
          alcoholBottlesWeight: "",
        };
      });
      setFormInputs(initialFormStates);
    }
  }, [filteredPickups]);

  const handleInputChange = (pickupId, name, value) => {
    const parsedValue = value === "" ? "" : parseFloat(value);
    setFormInputs((prev) => ({
      ...prev,
      [pickupId]: {
        ...prev[pickupId],
        [name]: parsedValue,
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
    const aluminumWeight =
      parseFloat(formInputs[pickupId]?.aluminumWeight) || 0;
    const plasticWeight = parseFloat(formInputs[pickupId]?.plasticWeight) || 0;
    const glassWeight = parseFloat(formInputs[pickupId]?.glassWeight) || 0;
    const alcoholBottlesWeight =
      parseFloat(formInputs[pickupId]?.alcoholBottlesWeight) || 0;

    if (
      aluminumWeight <= 0 &&
      plasticWeight <= 0 &&
      glassWeight <= 0 &&
      alcoholBottlesWeight <= 0
    ) {
      setError(
        "Please enter a valid weight for at least one type of material."
      );
      return;
    }

    setError("");

    try {
      const pickupDocRef = doc(db, `pickups`, pickupId);
      await updateDoc(pickupDocRef, {
        aluminumWeight,
        plasticWeight,
        glassWeight,
        alcoholBottlesWeight,
        isCompleted: true,
      });

      const currentWeights = profile?.stats?.weight || {};
      const updatedWeight = {
        aluminum: parseFloat(currentWeights.aluminum || 0) + aluminumWeight,
        plastic: parseFloat(currentWeights.plastic || 0) + plasticWeight,
        glass: parseFloat(currentWeights.glass || 0) + glassWeight,
        alcoholBottles:
          parseFloat(currentWeights.alcoholBottles || 0) + alcoholBottlesWeight,
      };

      await updateProfileData(user.uid, {
        stats: {
          ...profile?.stats,
          weight: updatedWeight,
        },
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
    <IonPage color="primary">
      <IonHeader translucent={true}>
        <IonToolbar color="primary">
          <IonTitle>Schedule</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton>History</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-no-padding ion-no-margin">
        <IonCard className="h-full p-0 m-0">
          <IonList className="ion-no-margin flex flex-col h-full overflow-auto">
            <IonListHeader className="ion-no-padding bg-white">
              <IonRow className="w-full">
                <IonCol size="12" className="mx-auto border-b border-b-light">
                  <h1 className="px-2">
                    {filteredPickups.length === 0
                      ? "No Pickups"
                      : `Pickups (${filteredPickups?.length || 0})`}
                  </h1>
                </IonCol>
              </IonRow>
            </IonListHeader>

            <IonAccordionGroup className="p-2 flex-grow">
              {filteredPickups.length > 0 ? (
                filteredPickups.map((pickup) => {
                  const { dayOfWeek, monthName, day, year } = formatDateInfo(
                    pickup.pickupDate
                  );

                  return (
                    <IonAccordion
                      className="p-2"
                      key={pickup.id}
                      value={pickup.id}
                    >
                      <IonItem slot="header">
                        <IonLabel>
                          <IonText>
                            <h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2>
                          </IonText>
                          <IonText>
                            {pickup.addressData.street || "Unknown Address"}
                          </IonText>
                        </IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        <IonGrid>
                          <IonRow>
                            <IonCol size="4" className="">
                              <IonText>
                                Pickup Notes: {pickup.pickupNote || "No Notes"}
                              </IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="6">
                              <IonItem>
                                <IonLabel position="stacked">
                                  Aluminum (lbs)
                                </IonLabel>
                                <IonInput
                                  type="number"
                                  step="any"
                                  value={
                                    formInputs[pickup.id]?.aluminumWeight || ""
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
                                  step="any"
                                  value={
                                    formInputs[pickup.id]?.plasticWeight || ""
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
                            <IonCol size="6">
                              <IonItem>
                                <IonLabel position="stacked">
                                  Glass (lbs)
                                </IonLabel>
                                <IonInput
                                  type="number"
                                  step="any"
                                  value={
                                    formInputs[pickup.id]?.glassWeight || ""
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
                                  step="any"
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

                          {error && (
                            <IonRow>
                              <IonCol>
                                <IonText color="danger">
                                  <p>{error}</p>
                                </IonText>
                              </IonCol>
                            </IonRow>
                          )}

                          <IonRow>
                            <IonCol>
                              <IonButton
                                expand="block"
                                type="submit"
                                color="primary"
                                onClick={(e) => handleSubmit(pickup.id, e)}
                              >
                                Complete Pickup
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </div>
                    </IonAccordion>
                  );
                })
              ) : (
                <IonItem lines="none" className="h-full flex items-center justify-center">
                  <IonRow className="ion-text-center w-full">
                    <IonCol size="auto" className="ion-align-self-center mx-auto font-bold">
                      <IonText>No pickups to display</IonText>
                    </IonCol>
                  </IonRow>
                </IonItem>
              )}
            </IonAccordionGroup>
          </IonList>
        </IonCard>
      </IonContent>

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
    </IonPage>
  );
}

export default Schedule;
