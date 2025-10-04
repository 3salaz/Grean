import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonRow, IonText } from '@ionic/react'
import React from 'react'
import { usePickups } from '../../context/PickupsContext';

type Props = {}

function DriverRoutes({ }: Props) {
  const { availablePickups, updatePickup } = usePickups();
  return (
    <section className="h-full w-full flex flex-col justify-end">
      <header className='flex-none ion-padding'>
        <IonCardHeader className="drop-shadow-none">
          <IonCardTitle className="">
            Driver Routes
          </IonCardTitle>
          <IonCardSubtitle className="text-white">
            Oragnize pickups to your own route
          </IonCardSubtitle>
        </IonCardHeader>
      </header>
      <main className='flex-grow overflow-auto ion-padding-vertical'>
        <div className='h-full bg-white rounded-md'>
        </div>
      </main>
    </section>
  )
}

export default DriverRoutes