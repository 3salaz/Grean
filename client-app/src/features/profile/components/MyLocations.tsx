import {
  IonButton,
  IonCol,
  IonIcon,
  IonRow,
  IonSpinner,
  IonText,
  IonInput,
  IonTextarea,
  IonModal
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { addCircle, settingsOutline, settingsSharp } from "ionicons/icons";
import CreateLocation from "./CreateLocation";
import { UserProfile } from "@/context/ProfileContext";
import { useUserLocations, LocationData } from "@/hooks/useUserLocations";
import { useLocations } from "@/context/LocationsContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import { toast } from "react-toastify";
import { settings } from "firebase/analytics";

interface MyLocationsProps {
  profile: UserProfile | null;
}

const MyLocations: React.FC<MyLocationsProps> = ({ profile }) => {
  const presentingElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    presentingElement.current = document.querySelector('ion-router-outlet');
  }, []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentLocation, setCurrentLocation, updateLocation } = useLocations();
  const { locations: userLocations, refreshLocations } = useUserLocations(profile?.locations || []);
  const [editedLocations, setEditedLocations] = useState<LocationData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);



  useEffect(() => {
    setEditedLocations(userLocations);
  }, [userLocations]);

  const updateField = (index: number, field: keyof LocationData, value: string) => {
    setEditedLocations((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const saveEdit = async (index: number) => {
    const updated = editedLocations[index];
    setIsSaving(true);
    try {
      if (!updated.id) throw new Error("Missing location ID");

      await updateLocation(updated.id, {
        businessName: updated.businessName,
        businessPhoneNumber: updated.businessPhoneNumber,
        businessBio: updated.businessBio,
      });

      await refreshLocations();
      setEditingIndex(null);
    } catch (err) {
      console.error("Error saving location", err);
      toast.error("Failed to save location.");
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <IonCol size="12" className="ion-padding bg-white rounded-md drop-shadow-lg shadow-lg">

      <IonModal isOpen={showCreateModal} presentingElement={presentingElement.current!}>
        <CreateLocation profile={profile} handleClose={() => setShowCreateModal(false)} />
      </IonModal>

      <div className="ion-padding">
        <IonText className="text-lg font-semibold text-[#3a6833]">My Locations</IonText>
      </div>

      {userLocations.length === 0 ? (
        <div className="ion-padding">
          <div className="text-center font-medium italic ion-padding bg-white bg-opacity-40 rounded-md">
            <IonText className="text-xs text-[#3a6833]">
              No Locations (Add a location to get started)
            </IonText>
          </div>
        </div>

      ) : (
        <div className="drop-shadow-2xl relative bg-[#75B657]/80 rounded-md p-2">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            onSlideChange={(swiper) => {
              const idx = swiper.activeIndex;
              setSelectedIndex(idx);
              setCurrentLocation(userLocations[idx]);
            }}
          >
            {userLocations.map((loc, idx) => {
              const isEditing = editingIndex === idx;
              const locData = editedLocations[idx];
              return (
                <SwiperSlide key={loc.id}>
                  <div
                    className={`rounded-lg drop-shadow-lg w-full flex flex-col items-center transition-all duration-200 ion-padding
      ${selectedIndex === idx
                        ? "border-2 border-[#75B657] bg-white"
                        : "border border-gray-200 bg-white/80 backdrop-blur"}`}
                  >
                    {isSaving && idx === selectedIndex ? (
                      <div className="flex justify-center items-center w-full">
                        <IonSpinner name="dots" />
                      </div>
                    ) : isEditing ? (
                      <>
                        <IonInput
                          label="Business Name"
                          value={locData.businessName || ""}
                          placeholder="Name"
                          onIonChange={e => updateField(idx, "businessName", e.detail.value!)}
                        />
                        <IonInput
                          label="Phone"
                          value={locData.businessPhoneNumber || ""}
                          placeholder="Phone"
                          onIonChange={e => updateField(idx, "businessPhoneNumber", e.detail.value!)}
                        />
                        <IonTextarea
                          label="Bio"
                          value={locData.businessBio || ""}
                          placeholder="Bio"
                          onIonChange={e => updateField(idx, "businessBio", e.detail.value!)}
                        />
                        <div className="flex gap-2 mt-2">
                          <IonButton size="small" onClick={() => saveEdit(idx)}>Save</IonButton>
                          <IonButton size="small" fill="clear" onClick={() => setEditingIndex(null)}>Cancel</IonButton>
                        </div>
                      </>
                    ) : (
                      <>
                        {loc.businessLogo && (
                          <img
                            src={loc.businessLogo}
                            alt={loc.businessName}
                            className="w-20 h-20 rounded-full object-cover border border-gray-300"
                          />
                        )}
                        <h3 className="text-base font-semibold text-center text-gray-800">{loc.businessName}</h3>
                        <IonText className="text-xs text-gray-500 text-center px-2 line-clamp-3 w-full">
                          {loc.businessBio}
                        </IonText>
                        <IonText className="text-xs text-gray-400 text-center">{loc.address}</IonText>
                      </>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2" />
          <div className="ion-padding-horizontal flex justify-center gap-4 p-2 pb-0">
            <IonButton
              fill="solid"
              color="light"
              shape="round"
              size="small"
              onClick={() => setShowCreateModal(true)}
            >
              <IonIcon color="secondary" slot="icon-only" icon={addCircle} />
            </IonButton>

            <IonButton fill="solid" color="light" shape="round" size="small" onClick={() => setEditingIndex(selectedIndex)}>
              <IonIcon color="secondary" slot="icon-only" icon={settingsSharp} />
            </IonButton>

          </div>
        </div>
      )}



    </IonCol>
  );
};

export default MyLocations;
