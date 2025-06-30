import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonCol,
    IonItem,
    IonLabel,
    IonRow,
    IonText,
  } from '@ionic/react';
  import React from 'react';
  import { usePickups } from '../../context/PickupsContext';
  import dayjs from 'dayjs';
  import { toast } from 'react-toastify';
  
  type Material = { type: string }; // adjust if needed
  
  function PickupInProgress() {
    const { userAssignedPickups, completePickup } = usePickups();
    const [weights, setWeights] = React.useState<Record<string, Record<string, string>>>({});
  
    function handleWeightChange(pickupId: string, materialType: string, value: string) {
      setWeights(prev => ({
        ...prev,
        [pickupId]: {
          ...prev[pickupId],
          [materialType]: value,
        },
      }));
    }
  
    async function handleCompletePickup(pickupId: string, materials: Material[]) {
      const materialWeights: { type: string; weight: number }[] = [];
  
      for (const { type } of materials) {
        const str = weights[pickupId]?.[type] || '';
        const n = parseFloat(str);
        if (isNaN(n) || n <= 0) {
          toast.error(`Please enter a valid weight for "${type}".`);
          return;
        }
        materialWeights.push({ type, weight: n });
      }
  
      try {
        await completePickup(pickupId, materialWeights);
        toast.success('✅ Pickup completed successfully!');
        setWeights(prev => {
          const { [pickupId]: _, ...rest } = prev;
          return rest;
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to complete pickup.');
      }
    }
  
    const inProgress = userAssignedPickups.filter(p => p.status === 'inProgress');
  
    return (
      <IonRow className="rounded-md">
        <IonCol size="12" className="text-center">
          <IonText className="text-lg font-semibold ion-padding">
            Pickup In Progress
          </IonText>
        </IonCol>
        <IonCol size="12" className="ion-padding-horizontal">
          {inProgress.length ? (
            <IonAccordionGroup className="rounded-md" expand="compact">
              {inProgress.map(pickup => (
                <IonAccordion key={pickup.id} value={pickup.id} className="rounded-md">
                  <IonItem slot="header" className="bg-green-200 w-full rounded-md">
                    <IonLabel>
                      <IonText className="font-medium text-sm">
                        {dayjs(pickup.pickupTime).format('dddd, MMM D • h:mm A')}
                      </IonText>
                      <div className="text-xs text-slate-600">{pickup.addressData.address}</div>
                    </IonLabel>
                  </IonItem>
                  <div
                    slot="content"
                    className="ion-padding border-t border-gray-300 flex flex-col gap-2"
                  >
                    {pickup.materials.map(material => (
                      <IonRow key={material.type}>
                        <IonCol size="12" sizeMd="6">
                          <input
                            className="w-full p-2 border rounded-md"
                            type="number"
                            placeholder={`${material.type} weight (lbs)`}
                            value={weights[pickup.id]?.[material.type] || ''}
                            onChange={e =>
                              handleWeightChange(pickup.id, material.type, e.target.value)
                            }
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
    );
  }
  
  export default PickupInProgress;
  