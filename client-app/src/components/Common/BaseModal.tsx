import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonFooter,
} from "@ionic/react";
import { close } from "ionicons/icons";

interface BaseModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;

  /** Optional modal title */
  title?: string;

  /** Called when the modal is dismissed */
  onDismiss: () => void;

  /** Modal content (forms, text, etc.) */
  children: React.ReactNode;

  /** Optional footer (e.g., action buttons) */
  footer?: React.ReactNode;

  /** Makes modal take full height (sheet behavior otherwise) */
  fullscreen?: boolean;

  /** Show or hide the top toolbar */
  showHeader?: boolean;

  /** Optional class for custom styling */
  className?: string;
}

/**
 * BaseModal — a reusable modal wrapper for consistent styling and structure.
 * Use it across the app for forms, dialogs, settings, etc.
 */
const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  title,
  onDismiss,
  children,
  footer,
  fullscreen = false,
  showHeader = true,
  className = "",
}) => {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      className={`grean-modal ${className}`}
      initialBreakpoint={fullscreen ? 1 : 0.6}
      breakpoints={fullscreen ? [0, 1] : [0, 0.6, 0.9]}
    >
      {showHeader && (
        <IonHeader translucent>
          <IonToolbar>
            <IonTitle>{title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onDismiss}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}

      <IonContent className="ion-padding">{children}</IonContent>

      {footer && (
        <IonFooter>
          <IonToolbar>{footer}</IonToolbar>
        </IonFooter>
      )}
    </IonModal>
  );
};

export default BaseModal;