import React, { useState } from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonCard,
} from "@ionic/react";

function EditLocation({ addressToEdit, onSubmit, onClose, onDelete }) {
  const [editAddress, setEditAddress] = useState(addressToEdit);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

  const confirmDelete = () => {
    onDelete(editAddress); // Call the delete function passed in props
    setIsDeleteAlertVisible(false);
    onClose(); // Close the modal after deletion
  };

  return (
    <IonContent color="primary" className="flex items-center justify-center">
      <IonGrid class="h-[92svh]">
        <IonRow className="h-full">
          <IonCol size="12" className="ion-align-self-center">
            <IonCard className="min-h-[550px]">
              <form onSubmit={onSubmit}>
                <IonItem>
                  <IonLabel position="stacked">Location Type</IonLabel>
                  <IonInput
                    value={editAddress.locationType}
                    onIonChange={(e) =>
                      setEditAddress({
                        ...editAddress,
                        locationType: e.detail.value,
                      })
                    }
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Street</IonLabel>
                  <IonInput
                    value={editAddress.street}
                    onIonChange={(e) =>
                      setEditAddress({ ...editAddress, street: e.detail.value })
                    }
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">City</IonLabel>
                  <IonInput
                    value={editAddress.city}
                    onIonChange={(e) =>
                      setEditAddress({ ...editAddress, city: e.detail.value })
                    }
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">State</IonLabel>
                  <IonInput
                    value={editAddress.state}
                    onIonChange={(e) =>
                      setEditAddress({ ...editAddress, state: e.detail.value })
                    }
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonButton color="danger" onClick={onDelete}>
                    Delete
                  </IonButton>
                  <IonButton type="submit">Save</IonButton>
                  <IonButton color="medium" onClick={onClose}>
                    Cancel
                  </IonButton>
                </IonItem>
              </form>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonAlert
          isOpen={isDeleteAlertVisible}
          onDidDismiss={() => setIsDeleteAlertVisible(false)}
          header={"Confirm Delete"}
          message={"Are you sure you want to delete this location?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                setIsDeleteAlertVisible(false);
              },
            },
            {
              text: "Delete",
              handler: confirmDelete,
            },
          ]}
        />
      </IonGrid>
    </IonContent>
  );
}

export default EditLocation;
