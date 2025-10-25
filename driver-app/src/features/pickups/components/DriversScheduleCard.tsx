import {
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonAccordionGroup, IonItem, IonLabel, IonText,
  IonAccordion, IonGrid, IonRow, IonCol, IonButton
} from "@ionic/react";
import noPickupsIcon from "@/assets/no-pickups.svg";
import { formatDateInfo } from "@/utils/dateUtils";
import { usePickups } from "@/context/PickupsContext";
import { toast } from "react-toastify";
import { deleteField } from "firebase/firestore";
import { useState } from "react";
import dayjs from "dayjs";
import Calendar from "@/features/pickups/components/Calendar";


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
    <section className="h-full w-full flex flex-col justify-end">
      <div className='flex-none ion-padding'>
        <IonCardHeader>
          <IonCardTitle className="font-bold">
            {relevantPickups.length === 0
              ? "No Pickups"
              : `Pickups: (${relevantPickups.length})`}
          </IonCardTitle>
          <IonCardSubtitle className="text-white">Your assigned pickups</IonCardSubtitle>
        </IonCardHeader>
      </div>

      <main className="flex-grow overflow-auto ion-padding-vertical flex flex-col justify-between">
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <IonAccordionGroup className="flex flex-col gap-1 justify-end h-full bg-white/40 rounded-md p-2" expand="compact">
          {relevantPickups.length === 0 ? (
            <div className="flex flex-grow flex-col items-center justify-center rounded-md gap-2 bg-white ion-padding">
              <img src={noPickupsIcon} alt="No pickups" className="w-32 h-32" />
              <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
            </div>
          ) : (
            relevantPickups.map((p) => {
              const { dayOfWeek, monthName, day, year } = formatDateInfo(p.pickupTime);
              return (
                <IonAccordion className="rounded-md" key={p.id} value={p.id}>
                  {/* Header */}
                  <IonItem slot="header">

                    <IonRow>
                      <IonCol size="12">
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
                      </IonCol>
                      <IonCol>
                        <p className="text-sm font-medium">{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</p>
                        <p className="text-xs text-gray-500">
                          {p.addressData?.address?.split(",").slice(0, 2).join(", ") || "Unknown Address"}
                        </p>

                      </IonCol>
                    </IonRow>
                  </IonItem>

                  {/* Content */}
                  <div slot="content" className="p-2 pl-4 bg-slate-100 text-sm">
                    {/* Materials */}
                    {p.materials.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700 mb-2">
                        {p.materials.map((m, index) => (
                          <div key={index}>
                            <strong>{m.type.charAt(0).toUpperCase() + m.type.slice(1)}:</strong> {m.weight} lbs
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Note */}
                    {p.pickupNote && (
                      <p className="text-[11px] text-gray-500 italic mb-2">
                        Note: {p.pickupNote}
                      </p>
                    )}

                    {/* Action Buttons */}
                    {p.status === "accepted" && (
                      <div className="flex gap-2 mt-2">
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
                </IonAccordion>
              );
            })
          )}
        </IonAccordionGroup>

        {/* Calendar Component */}

      </main>
    </section>
  );
}

