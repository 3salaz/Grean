import {
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonAccordionGroup, IonItem, IonLabel, IonText,
    IonAccordion, IonGrid, IonRow, IonCol, IonInput, IonButton
} from "@ionic/react";
import noPickupsIcon from "../../assets/no-pickups.svg";
import { useProfile } from "../../context/ProfileContext";
import { usePickups } from "../../context/PickupsContext";
import { formatDateInfo } from "../../utils/dateUtils";
import { useState } from "react";
import Calendar from "./Calendar";
import dayjs from "dayjs";

export default function UserScheduleCard() {
    const { userOwnedPickups } = usePickups();
    const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const relevantPickups = userOwnedPickups.filter(p => dayjs(p.pickupTime).isSame(selectedDate, 'day'));
    const userStatuses = ["pending", "accepted", "inProgress", "completed"];

    const pickupsByStatus: Record<string, typeof relevantPickups> =
        relevantPickups.reduce((acc, p) => {
            acc[p.status] = acc[p.status] || [];
            acc[p.status].push(p);
            return acc;
        }, {} as Record<string, typeof relevantPickups>);
    userStatuses.forEach(s => { if (!pickupsByStatus[s]) pickupsByStatus[s] = []; });

    const handleInputChange = (pickupId: string, name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [pickupId]: { ...(prev[pickupId] || {}), [name]: value }
        }));
    };

    return (
        <section className="h-full w-full ion-padding flex flex-col justify-end">
            <IonCardHeader className="ion-padding">
                <IonCardTitle className="font-bold">
                    {relevantPickups.length === 0
                        ? "No Pickups"
                        : `Pickups: (${relevantPickups.length})`}
                </IonCardTitle>
                <IonCardSubtitle className="text-white">
                    View or edit your pickups below
                </IonCardSubtitle>
            </IonCardHeader>

            <main className="flex-grow overflow-auto flex flex-col gap-2">
                {relevantPickups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-grow rounded-md gap-2 bg-white">
                        <img src={noPickupsIcon} alt="No pickups" className="w-32 h-32 my-2" />
                        <IonText className="text-base text-gray-500 font-bold">
                            No pickups to display
                        </IonText>
                    </div>
                ) : (
                    relevantPickups.map((p) => {
                        const { dayOfWeek, monthName, day, year } = formatDateInfo(p.pickupTime);
                        return (
                            <div key={p.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h3>
                                        <p className="text-sm text-gray-500">{p.addressData.address || "Unknown Address"}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium text-white ${p.status === 'pending' ? 'bg-yellow-500' :
                                        p.status === 'accepted' ? 'bg-blue-500' :
                                            p.status === 'inProgress' ? 'bg-purple-500' :
                                                'bg-green-600'
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                    {p.materials.map((m, index) => (
                                        <div key={index} className="text-sm text-gray-700">
                                            <strong>{m.type.charAt(0).toUpperCase() + m.type.slice(1)}</strong>: {m.weight} lbs
                                        </div>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-600 italic mb-3">
                                    Pickup Notes: {p.pickupNote || "None"}
                                </p>

                                {["pending", "accepted"].includes(p.status) && (
                                    <div className="flex gap-2">
                                        <IonButton expand="block" color="primary" size="small">Edit Pickup</IonButton>
                                        <IonButton expand="block" color="danger" size="small">Delete Pickup</IonButton>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </main>

        </section>

    );
}
