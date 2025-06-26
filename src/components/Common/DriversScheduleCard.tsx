import {
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonAccordionGroup, IonItem, IonLabel, IonText,
  IonAccordion, IonGrid, IonRow, IonCol, IonButton
} from "@ionic/react";
import noPickupsIcon from "../../assets/no-pickups.svg";
import { formatDateInfo } from "../../utils/dateUtils";
import { usePickups } from "../../context/PickupsContext";
import { useProfile } from "../../context/ProfileContext";
import { toast } from "react-toastify";
import { deleteField } from "firebase/firestore";
import { useState } from "react";
import dayjs from "dayjs";
import Calendar from "./Calendar";


export default function DriversScheduleCard() {
  const { userAssignedPickups, updatePickup } = usePickups();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const inProgressPickup = userAssignedPickups.find(p => p.status === "inProgress");


  const relevantPickups = userAssignedPickups;
  const driverStatuses = ["accepted"];

  const pickupsByStatus: Record<string, typeof relevantPickups> =
    relevantPickups.reduce((acc, p) => {
      acc[p.status] = acc[p.status] || [];
      acc[p.status].push(p);
      return acc;
    }, {} as Record<string, typeof relevantPickups>);
  driverStatuses.forEach(s => { if (!pickupsByStatus[s]) pickupsByStatus[s] = []; });

  const handleStartPickup = async (pickupId: string) => {
    try {
      await updatePickup(pickupId, { status: "inProgress" });
    } catch (err) {
      console.error("Failed to start pickup:", err);
    }
  };

  const handleCancelPickup = async (pickupId: string) => {
    try {
      await updatePickup(pickupId, {
        acceptedBy: deleteField(),
        status: "pending",
      });
      toast.success("Pickup has been reset to pending.");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel the pickup.");
    }
  };

  return (
    <section className="h-full w-full ion-padding flex flex-col justify-end">
      <IonCardHeader className="drop-shadow-none">
        <IonCardTitle className="font-bold">
          {relevantPickups.length === 0
            ? "No Pickups"
            : `Pickups: (${relevantPickups.length})`}
        </IonCardTitle>
        <IonCardSubtitle className="text-white">Your assigned pickups</IonCardSubtitle>
      </IonCardHeader>

      <main className="flex-grow overflow-auto flex flex-col gap-3 ion-padding-vertical">
        {relevantPickups.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow rounded-md gap-2 bg-white p-4">
            <img src={noPickupsIcon} alt="No pickups" className="w-32 h-32" />
            <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
          </div>
        ) : (
          relevantPickups.map((p) => {
            const { dayOfWeek, monthName, day, year } = formatDateInfo(p.pickupTime);
            return (
              <div
                key={p.id}
                className="rounded-md bg-white p-3 shadow-sm border border-slate-200"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm">
                    <p className="font-semibold">{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</p>
                    <p className="text-xs text-gray-500">{p.addressData.address || "Unknown Address"}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[11px] rounded-full font-medium text-white ${p.status === "pending"
                      ? "bg-yellow-500"
                      : p.status === "accepted"
                        ? "bg-blue-500"
                        : p.status === "inProgress"
                          ? "bg-purple-500"
                          : "bg-green-800"
                      }`}
                  >
                    {p.status}
                  </span>
                </div>

                {p.materials.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700 mb-1">
                    {p.materials.map((m, index) => (
                      <div key={index}>
                        <strong>{m.type.charAt(0).toUpperCase() + m.type.slice(1)}:</strong> {m.weight} lbs
                      </div>
                    ))}
                  </div>
                )}

                {p.pickupNote && (
                  <p className="text-[11px] text-gray-500 italic mb-2">
                    Note: {p.pickupNote}
                  </p>
                )}

                {p.status === "accepted" && (
                  <div className="flex gap-2">
                    <IonButton
                      expand="block"
                      color="primary"
                      size="small"
                      onClick={() => handleStartPickup(p.id)}
                      disabled={!!inProgressPickup && inProgressPickup.id !== p.id}
                    >
                      Start
                    </IonButton>
                    <IonButton
                      expand="block"
                      color="danger"
                      size="small"
                      onClick={() => handleCancelPickup(p.id)}
                    >
                      Cancel
                    </IonButton>
                  </div>
                )}

              </div>
            );
          })
        )}

        {/* Calendar Component */}

        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </main>
    </section>
  );
}

