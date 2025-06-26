import { IonAccordion, IonAccordionGroup, IonCol, IonItem, IonLabel, IonRow, IonText } from '@ionic/react'
import React from 'react'
import { usePickups } from '../../context/PickupsContext';
import dayjs from 'dayjs';

type Props = {}

function PickupInProgress({ }: Props) {
    const { userAssignedPickups } = usePickups();
    const [weights, setWeights] = React.useState<Record<string, Record<string, string>>>({});
    return (
        <IonRow className="ion-padding bg-white rounded-md">
            <IonCol size="12">
                <IonText className="text-lg font-semibold ion-padding">Pickup In Progress</IonText>
            </IonCol>
            <IonCol size="12">
                {userAssignedPickups.filter(p => p.status === "inProgress").length > 0 ? (
                    <IonAccordionGroup className="rounded-md" expand="compact">
                        {userAssignedPickups
                            .filter(p => p.status === "inProgress")
                            .map((pickup) => (
                                <IonAccordion className="rounded-md" key={pickup.id} value={pickup.id}>
                                    <IonItem slot="header" className="bg-green-200 w-full rounded-md">
                                        <IonLabel>
                                            <IonText className="font-medium text-sm">
                                                {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                                            </IonText>
                                            <div className="text-xs text-slate-600">{pickup.addressData.address}</div>
                                        </IonLabel>
                                    </IonItem>
                                    <div slot="content" className="ion-padding border-t border-gray-300 flex flex-col gap-2">
                                        {pickup.materials.map((materialObj) => (
                                            <IonRow key={materialObj.type} className="">
                                                <IonCol size="12" sizeMd="6">
                                                    <input
                                                        className="w-full p-2 border rounded-md"
                                                        type="number"
                                                        placeholder={`${materialObj.type} weight (lbs)`}
                                                        value={weights[pickup.id]?.[materialObj.type] || ""}
                                                        onChange={(e) => handleWeightChange(pickup.id, materialObj.type, e.target.value)}
                                                    />
                                                </IonCol>
                                            </IonRow>
                                        ))}

                                        <div className="mt-3 flex justify-start">
                                            <IonButton
                                                size="small"
                                                color="tertiary"
                                                onClick={() => handleCompletePickup(pickup.id, pickup.materials)}
                                            >
                                                Complete Pickup
                                            </IonButton>
                                        </div>
                                    </div>

                                </IonAccordion>
                            ))}
                    </IonAccordionGroup>
                ) : (
                    <IonText className="text-gray-500 text-sm">No Pickup In Progress</IonText>
                )}
            </IonCol>
        </IonRow>
    )
}

export default PickupInProgress