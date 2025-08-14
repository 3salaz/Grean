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
import { useTab } from '../../context/TabContext';
import { TabOption } from '../../types/tabs';

interface FooterProps {
  availableTabs: TabOption[];
}

const tabConfig: Record<TabOption, { label: string; icon: string }> = {
  profile: { label: 'Profile', icon: personCircleOutline },
  pickups: { label: 'Pickups', icon: leafOutline },
  map: { label: 'Map', icon: navigateCircleOutline },
  stats: { label: 'Stats', icon: statsChartOutline },
};

function Footer({ availableTabs }: FooterProps) {
  const { activeTab, setActiveTab } = useTab();

  return (
    <IonFooter className="h-[8svh] flex items-center justify-center">
      <IonToolbar
        color="secondary"
        className="flex items-center justify-center h-full"
      >
        <IonSegment
          className="max-w-2xl mx-auto"
          value={activeTab}
          onIonChange={(e: CustomEvent) => setActiveTab(e.detail.value as TabOption)}
        >
          {availableTabs.map((tab) => (
            <IonSegmentButton key={tab} value={tab}>
              <IonLabel className="text-xs">{tabConfig[tab].label}</IonLabel>
              <IonIcon icon={tabConfig[tab].icon} />
            </IonSegmentButton>
          ))}
        </IonSegment>
      </IonToolbar>
    </IonFooter>
  );
}

export default Footer;