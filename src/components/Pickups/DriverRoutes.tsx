import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonRow, IonText } from '@ionic/react'
import React from 'react'
import { usePickups } from '../../context/PickupsContext';

type Props = {}

function DriverRoutes({}: Props) {
    const { availablePickups, updatePickup } = usePickups();
  return (

    <section className="h-full w-full ion-padding flex flex-col justify-end">
    <IonCardHeader className="drop-shadow-none">
      <IonCardTitle className="">
        Driver Routes
      </IonCardTitle>
      <IonCardSubtitle>
        Oragnize pickups to your own route
      </IonCardSubtitle>
    </IonCardHeader>
    <main className='flex-grow flex flex-col overflow-auto gap-2 ion-padding-vertical'>
        <div className='h-full bg-white rounded-md'>
        </div>
    </main>
    </section>
  )
}

export default DriverRoutes