import {
  IonRow,
  IonCol,
  IonText,
  IonButton
} from "@ionic/react";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { usePickups } from "../../context/PickupsContext";

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
      <IonRow className="ion-justify-content-evenly ion-padding-vertical">
        {weekDates.map((date) => {
          const isActive = date.isSame(selectedDate, 'day');
          const pickupCount = countPickupsOnDate(date);

          return (
            <IonCol
              size="auto"
              key={date.format()}
              className={`p-2 rounded-md cursor-pointer text-center ${isActive
                  ? "border-2 border-green-600 shadow-md"
                  : "border border-dotted border-gray-400"
                }`}
              onClick={() => onDateChange(date)}
            >
              <div>{date.format("D")}</div>
              <div className="text-xs">{date.format("ddd")}</div>
              <div className="flex flex-wrap justify-center gap-1">
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
          <IonButton size="small" onClick={goToPreviousWeek}>
            This Week
          </IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonButton size="small" onClick={goToNextWeek}>
            Next Week
          </IonButton>
        </IonCol>
      </IonRow>
    </div>
  );
}
