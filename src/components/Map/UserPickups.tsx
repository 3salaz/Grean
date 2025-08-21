import {
  IonRow,
  IonCol,
  IonText,
  IonSpinner,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonButton,
} from "@ionic/react";
import { motion } from "framer-motion";
import { usePickups } from "../../context/PickupsContext";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import noPickupIcon from "../../../../assets/no-pickups.svg";
import { useProfile } from "../../context/ProfileContext";
const { profile } = useProfile();
const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];

function UserPickups() {

  const { userOwnedPickups } = usePickups();

  const handleRefresh = () => {
    // Add actual logic here to refresh visible pickups
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <header className="flex-none ion-padding">
        <IonCardHeader className="drop-shadow-none">
          <IonCardTitle>
            {userOwnedPickups.length === 0
              ? "No Pickups"
              : `Your Pickups (${userOwnedPickups.length})`}
          </IonCardTitle>
          <IonCardSubtitle className="text-white">Scheduled Requests</IonCardSubtitle>
        </IonCardHeader>
      </header>

      {/* Main */}
      <main className="flex-grow overflow-auto ion-padding-vertical">
        {userOwnedPickups.length > 0 ? (
          <IonAccordionGroup className="bg-white rounded-md" expand="compact">
            {userOwnedPickups.map((pickup) => (
              <IonAccordion key={pickup.id} value={pickup.id}>
                <IonItem slot="header" className="bg-yellow-400">
                  <IonCol>
                    <IonText className="text-sm font-medium block">
                      {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                    </IonText>
                    <div className="text-xs text-slate-100">
                      {pickup.addressData.address}
                    </div>
                  </IonCol>
                </IonItem>
                <div slot="content" className="ion-padding bg-slate-50 border-t border-gray-300 text-sm">
                  <div className="mb-2">
                    <strong>Status:</strong>{" "}
                    {pickup.acceptedBy ? (
                      <span className="text-green-600">Accepted</span>
                    ) : (
                      <span className="text-red-600">Pending</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <strong>Completed:</strong>{" "}
                    {pickup.status ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-600">No</span>
                    )}
                  </div>
                </div>
              </IonAccordion>
            ))}
          </IonAccordionGroup>
        ) : (
          <div className="flex flex-col h-full items-center justify-center bg-white rounded-md p-4">
            <img src={noPickupIcon} alt="No pickups" className="w-16 h-16 mb-2" />
            <IonText className="text-base text-gray-500 font-bold">
              No pickups to display
            </IonText>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserPickups;
