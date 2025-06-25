import { useEffect, useState } from "react";
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
  IonButton, IonRow, IonCol, IonFooter, IonGrid, IonText
} from "@ionic/react";
import { usePickups } from "../../context/PickupsContext";
import { useProfile } from "../../context/ProfileContext";
import { toast } from "react-toastify";
import UsersScheduleCard from "../Common/UsersScheduleCard";
import DriversScheduleCard from "../Common/DriversScheduleCard";

interface ScheduleProps {
  handleClose: () => void;
}

const statuses = ["pending", "inProgress", "completed", "cancelled"] as const;
const userStatuses = ["pending", "accepted", "inProgress", "completed"];


function Schedule({ handleClose }: ScheduleProps) {
  const { userAssignedPickups, userOwnedPickups, fetchUserOwnedPickups, fetchUserAssignedPickups, updatePickup } = usePickups();
  const { profile } = useProfile();
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (profile?.uid) {
      if (profile.accountType === "User") {
        fetchUserOwnedPickups(profile.uid);
      } else {
        fetchUserAssignedPickups(profile.uid);
      }
    }
  }, [profile?.uid, profile?.accountType]);

  const relevantPickups = profile?.accountType === "User"
    ? userOwnedPickups
    : userAssignedPickups;

  const pickupsByStatus: Record<string, typeof relevantPickups> =
    relevantPickups.reduce((acc, p) => {
      acc[p.status] = acc[p.status] || [];
      acc[p.status].push(p);
      return acc;
    }, {} as Record<string, typeof relevantPickups>);
  statuses.forEach(s => { if (!pickupsByStatus[s]) pickupsByStatus[s] = []; });

  const handleInputChange = (pickupId: string, name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [pickupId]: { ...(prev[pickupId] || {}), [name]: value }
    }));
  };



  return (

    <IonGrid className="h-full w-full flex flex-col items-center justify-center gap-2 overflow-auto">
      {profile?.accountType === "User" ? (
        <UsersScheduleCard />
      ) : (
        <DriversScheduleCard />
      )}
    </IonGrid>
  );
}

export default Schedule;
