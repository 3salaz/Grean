import { useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
} from "@ionic/react";

function Contact() {
  const form = useRef();

  const sendEmail = (event) => {
    event.preventDefault();

    emailjs
      .sendForm(
        "service_d6aj2lw",
        "template_41orkiq",
        form.current,
        "tx3Q3atJsYPq2xTPe"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <IonContent className="h-full flex flex-col items-center p-2">
      <IonHeader>
        <IonToolbar className="bg-green text-white">
          <IonTitle>Contact</IonTitle>
        </IonToolbar>
      </IonHeader>
      <form
        ref={form}
        onSubmit={sendEmail}
        className="w-full max-w-lg bg-white p-4 rounded-md shadow-md"
      >
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput required name="user_name" type="text" />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput required name="user_email" type="email" />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Subject</IonLabel>
          <IonInput required name="subject" type="text" />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Message</IonLabel>
          <IonTextarea required name="message" rows={4} />
        </IonItem>

        <div className="flex justify-center mt-4">
          <IonButton type="submit" expand="full">
            Send
          </IonButton>
        </div>
      </form>
    </IonContent>
  );
}

export default Contact;