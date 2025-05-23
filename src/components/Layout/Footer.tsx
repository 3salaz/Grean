import { IonFooter, IonIcon, IonLabel, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react'
import { leafOutline, navigateCircleOutline, personCircleOutline, statsChartOutline } from 'ionicons/icons'
import { TabOption } from '../../types/tabs';
import React from 'react'


interface FooterProps {
    activeTab: TabOption;
    setActiveTab: React.Dispatch<React.SetStateAction<TabOption>>;
  }

  function Footer({ activeTab, setActiveTab }: FooterProps) {
  return (
    <IonFooter className="h-[8svh] flex items-center justify-center">
          <IonToolbar
            color="secondary"
            className="flex items-center justify-center h-full"
          >
            <IonSegment
              className="max-w-2xl mx-auto"
              value={activeTab}
              onIonChange={(e: CustomEvent) =>
                setActiveTab(e.detail.value as TabOption)
              }
            >
              <IonSegmentButton value="profile">
                <IonLabel className="text-xs">Profile</IonLabel>
                <IonIcon icon={personCircleOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="pickups">
                <IonLabel className="text-xs">Pickups</IonLabel>
                <IonIcon icon={leafOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="map">
                <IonLabel className="text-xs">Map</IonLabel>
                <IonIcon icon={navigateCircleOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="stats">
                <IonLabel className="text-xs">Stats</IonLabel>
                <IonIcon icon={statsChartOutline} />
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
    </IonFooter>
  )
}

export default Footer