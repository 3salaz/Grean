import React, {useState, useEffect} from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonAlert,
  IonCardHeader,
  IonCardContent,
  IonCardTitle
} from "@ionic/react";
import {useProfile, UserProfile} from "../context/ProfileContext";
import {toast} from "react-toastify";
import {useLocations} from "../context/LocationsContext";

function Testing() {
  const {createProfile, updateProfile, deleteProfile, profile} = useProfile();
  const {createLocation} = useLocations();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [locationData, setLocationData] = useState({
    locationType: "",
    address: "", // Complete address from autocomplete
    homeName: "",
    businessName: "",
    businessPhoneNumber: "",
    category: "",
    latitude: null as number | null,
    longitude: null as number | null
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        email: profile.email,
        profilePic: profile.profilePic,
        uid: profile.uid,
        locations: profile.locations,
        pickups: profile.pickups,
        accountType: profile.accountType
      });
    }
  }, [profile]);

  const handleChange = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  const handleCreateProfile = async () => {
    try {
      await createProfile(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (formData.displayName) {
        await updateProfile("displayName", formData.displayName);
      }
      if (formData.email) {
        await updateProfile("email", formData.email);
      }
      if (formData.profilePic) {
        await updateProfile("profilePic", formData.profilePic);
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.log(error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateLocation = async () => {
    if (!profile?.uid) {
      toast.error("User profile not found.");
      return;
    }
    // setLoading(true);
    try {
      const newLocation = {
        locationType: locationData.locationType,
        address: locationData.address,
        latitude: locationData.latitude ?? undefined,
        longitude: locationData.longitude ?? undefined,
        ...(locationData.locationType === "Home" && {
          homeName: locationData.homeName
        }),
        ...(locationData.locationType === "Business" && {
          businessName: locationData.businessName,
          businessPhoneNumber: locationData.businessPhoneNumber,
          category: locationData.category
        })
      };
      const newLocationId = await createLocation(newLocation);
      await updateProfile("locations", newLocationId, "addToArray");
      toast.success("Location added successfully!");
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Failed to add location.");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent scroll-y="false">
        <IonGrid>
          <IonCard className="ion-padding">
            <IonCardHeader>
              <IonCardTitle>Profile Functions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent class="flex gap-4">
              {/* Create Profile */}
              <IonRow>
                <IonCol size="auto" className="ion-padding">
                  <IonButton onClick={handleCreateProfile}>
                    Create Profile
                  </IonButton>
                </IonCol>
              </IonRow>

              {/* Update Profile */}
              {profile && (
                <IonRow class="bg-pink-100 ion-padding">
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="fixed">Name</IonLabel>
                      <IonInput
                        name="displayName"
                        value={formData.displayName || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="fixed">Email</IonLabel>
                      <IonInput
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="fixed">Profile Picture URL</IonLabel>
                      <IonInput
                        name="profilePic"
                        type="text"
                        value={formData.profilePic || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="auto" className="ion-padding">
                    <IonButton onClick={handleUpdateProfile}>
                      Edit Profile
                    </IonButton>
                  </IonCol>
                </IonRow>
              )}

              {/* Delete Profile */}
              {profile && (
                <IonRow>
                  <IonCol>
                    <IonButton onClick={() => setShowDeleteAlert(true)}>
                      Delete Profile
                    </IonButton>
                  </IonCol>
                </IonRow>
              )}
            </IonCardContent>
          </IonCard>
          <IonCard className="ion-padding">
            <IonCardHeader>
              <IonCardTitle>Location Functions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent class="flex gap-4">
              {/* Create Profile */}
              <IonRow>
                <IonCol size="auto" className="ion-padding">
                  <IonButton onClick={handleCreateLocation}>
                    Create Location
                  </IonButton>
                </IonCol>
              </IonRow>

              {/* Update Profile */}
              {profile && (
                <IonRow class="bg-pink-100 ion-padding">
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="fixed">Name</IonLabel>
                      <IonInput
                        name="displayName"
                        value={formData.displayName || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="fixed">Email</IonLabel>
                      <IonInput
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="fixed">Profile Picture URL</IonLabel>
                      <IonInput
                        name="profilePic"
                        type="text"
                        value={formData.profilePic || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="auto" className="ion-padding">
                    <IonButton onClick={handleUpdateProfile}>
                      Edit Profile
                    </IonButton>
                  </IonCol>
                </IonRow>
              )}

              {/* Delete Location */}
              {profile && (
                <IonRow>
                  <IonCol>
                    <IonButton onClick={() => setShowDeleteAlert(true)}>
                      Delete Profile
                    </IonButton>
                  </IonCol>
                </IonRow>
              )}
            </IonCardContent>
          </IonCard>
        </IonGrid>
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={"Delete Profile"}
          message={
            "Are you sure you want to delete your profile? This action cannot be undone."
          }
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                setShowDeleteAlert(false);
              }
            },
            {
              text: "Delete",
              handler: () => {
                handleDeleteProfile();
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
}

export default Testing;
