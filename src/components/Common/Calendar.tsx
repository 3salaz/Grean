import {
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon
} from "@ionic/react";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { usePickups } from "../../context/PickupsContext";
import { list } from "ionicons/icons";

interface CalendarProps {
  selectedDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
}

export default function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const { userOwnedPickups } = usePickups();
  const [referenceDate, setReferenceDate] = useState(dayjs());

  const getWeekDates = (refDate: Dayjs) => {
    return Array.from({ length: 7 }).map((_, i) => refDate.startOf('week').add(i, 'day'));
  };

  const [weekDates, setWeekDates] = useState<Dayjs[]>(getWeekDates(referenceDate));

  useEffect(() => {
    setWeekDates(getWeekDates(referenceDate));
  }, [referenceDate]);

  const goToPreviousWeek = () => {
    const newRefDate = referenceDate.subtract(7, "day");
    setReferenceDate(newRefDate);
    onDateChange(newRefDate);
  };

  const goToNextWeek = () => {
    const newRefDate = referenceDate.add(7, "day");
    setReferenceDate(newRefDate);
    onDateChange(newRefDate);
  };

  const countPickupsOnDate = (date: dayjs.Dayjs) => {
    return userOwnedPickups.filter(p => dayjs(p.pickupTime).isSame(date, 'day')).length;
  };

  return (
    <div className="w-full drop-shadow-lg ion-padding">
      <IonRow className="w-full">
        <IonCol size="auto">
          <IonText className="text-xl font-bold">Calendar</IonText>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-evenly ion-padding-vertical gap-1">
        {weekDates.map((date) => {
          const isActive = date.isSame(selectedDate, 'day');
          const pickupCount = countPickupsOnDate(date);

          return (
            <IonCol
              size="auto"
              key={date.format()}
              className={`py-2 px-1 border-1 rounded-lg cursor-pointer text-center bg-yellow-50 text-xs drop-shadow-xl flex-wrap flex flex-col ${isActive
                  ? "border-inset border-slate-100"
                  : "border-yellow-50"
                }`}
              onClick={() => onDateChange(date)}
            >
              <div className="text-lg">{date.format("D")}</div>
              <div className="text-xs">{date.format("ddd")}</div>
              <div className="flex flex-wrap justify-center">
                {Array.from({ length: pickupCount }).map((_, i) => (
                  <span key={i} className="bg-orange-500 w-2 h-2 rounded-full"></span>
                ))}
              </div>
            </IonCol>
          );
        })}
      </IonRow>
      <IonRow className="ion-justify-content-between ion-padding-horizontal">
        <IonCol size="auto">
          <IonButton color={"secondary"} size="small" onClick={goToPreviousWeek}>
            This Week
          </IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonButton color={"light"}>
            <IonIcon icon={list}></IonIcon>
          </IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonButton color={"secondary"} size="small" onClick={goToNextWeek}>
            Next Week
          </IonButton>
        </IonCol>
      </IonRow>
    </div>
  );
}
