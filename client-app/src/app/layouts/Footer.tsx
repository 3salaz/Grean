import {
  IonFooter,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar
} from '@ionic/react';
import {
  leafOutline,
  navigateCircleOutline,
  personCircleOutline,
  statsChartOutline
} from 'ionicons/icons';
import { useTab } from '@/context/TabContext';

function Footer() {
  const { activeTab, setActiveTab } = useTab();

  return (
    <IonFooter className="max-w-xl mx-auto">
      <IonToolbar
        color="secondary"
        className="flex items-center justify-center rounded-t-lg"
      >
        <IonSegment
          className="max-w-2xl mx-auto"
          value={activeTab}
          onIonChange={(e: CustomEvent) =>
            setActiveTab(e.detail.value)
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
  );
}

export default Footer;
