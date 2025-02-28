import React, { useState, useRef } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { motion, useInView } from "framer-motion";

function History({ handleClose }) {
  const [activeTab, setActiveTab] = useState("all");

  // Single array of pickupHistory data
  const pickupHistory = [
    { date: "2024-09-01", aluminumWeight: 10, plasticWeight: 5 },
    { date: "2024-09-02", aluminumWeight: 8, plasticWeight: 3 },
    { date: "2024-09-03", aluminumWeight: 12, plasticWeight: 6 },
    { date: "2024-09-04", aluminumWeight: 9, plasticWeight: 4 },
    { date: "2024-08-25", aluminumWeight: 50, plasticWeight: 20 },
    { date: "2024-08-18", aluminumWeight: 45, plasticWeight: 18 },
    { date: "2024-08-11", aluminumWeight: 55, plasticWeight: 22 },
    { date: "2024-01-01", aluminumWeight: 500, plasticWeight: 250 },
    { date: "2024-02-01", aluminumWeight: 480, plasticWeight: 240 },
    { date: "2024-03-01", aluminumWeight: 510, plasticWeight: 260 },
    { date: "2024-04-01", aluminumWeight: 520, plasticWeight: 270 },
  ];

  // Helper: Normalize dates (convert string to start-of-day Date)
  const normalizeDate = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // Filter data dynamically based on the active tab
  const filterData = () => {
    const currentDate = normalizeDate(new Date());
    switch (activeTab) {
      case "weekly":
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        return pickupHistory.filter(
          (item) => normalizeDate(item.date) >= oneWeekAgo
        );
      case "monthly":
        return pickupHistory.filter((item) => {
          const itemDate = normalizeDate(item.date);
          return (
            itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear()
          );
        });
      case "all":
      default:
        return pickupHistory;
    }
  };

  const activeHistory = filterData();

  // Ref and useInView for triggering animations
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handlePickupClick = (pickup) => {
    console.log("Pickup clicked:", pickup);
  };

  return (
    <IonGrid className="m-0 p-0 flex flex-col" ref={ref}>
      <IonRow className="bg-white">
        {/* Tabs */}
        <IonCol size="12" className="ion-padding">
          <IonSegment
            value={activeTab}
            className="bg-grean rounded-md transition-all duration-500"
            onIonChange={(e) => setActiveTab(e.detail.value)}
          >
            <IonSegmentButton
              value="all"
              className={activeTab === "all" ? "bg-white" : "text-white"}
            >
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="weekly"
              className={activeTab === "weekly" ? "bg-white" : "text-white"}
            >
              <IonLabel>Weekly</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="monthly"
              className={activeTab === "monthly" ? "bg-white" : "text-white"}
            >
              <IonLabel>Monthly</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonCol>

        {/* History List */}
        <IonCol size="12" className="ion-padding">
          <motion.div
            key={activeTab} // Re-trigger animation on tab change
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IonList
              className="w-full bg-transparent overflow-auto"
              style={{ minHeight: "300px", maxHeight: "400px" }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <IonListHeader className="text-xl font-bold text-center">
                  History |{" "}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </IonListHeader>
              </motion.div>

              {/* Table Headers */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <IonItem className="flex justify-between font-bold bg-transparent">
                  <IonLabel>Date</IonLabel>
                  <IonLabel>Aluminum</IonLabel>
                  <IonLabel>Plastic</IonLabel>
                </IonItem>
              </motion.div>

              {/* Animated List Items */}
              {activeHistory.map((pickup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <IonItem
                    className="flex justify-between cursor-pointer"
                    onClick={() => handlePickupClick(pickup)}
                  >
                    <IonLabel>{pickup.date}</IonLabel>
                    <IonLabel>
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {pickup.aluminumWeight} lbs
                      </motion.span>
                    </IonLabel>
                    <IonLabel>
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {pickup.plasticWeight} lbs
                      </motion.span>
                    </IonLabel>
                  </IonItem>
                </motion.div>
              ))}
            </IonList>
          </motion.div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

export default History;
