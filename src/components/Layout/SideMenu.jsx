import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';

const SideMenu = () => {
  return (
    <IonMenu side="start" contentId="content">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button>
            <IonLabel>Home</IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>About</IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>Services</IonLabel>
          </IonItem>
          <IonItem button>
            <IonLabel>Contact</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
