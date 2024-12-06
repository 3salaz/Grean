import React, { useState } from "react";
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFabButton,
  IonIcon,
  IonContent,
} from "@ionic/react";
import { toast, ToastContainer } from "react-toastify";
import { useAuthProfile } from "../../context/AuthProfileContext";
import "react-toastify/dist/ReactToastify.css";
import { closeOutline, logoGoogle } from "ionicons/icons";

function Signup({ handleClose, toggleToSignin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, googleSignIn } = useAuthProfile();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsSubmitting(true);
      await googleSignIn();
      toast.success("Signed up successfully with Google!");
      handleClose();
    } catch (error) {
      toast.error("Error signing up with Google. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Prepare profile data
      const profileData = {
        email: formData.email,
        uid: "", // UID will be assigned in the `signUp` function
        createdAt: new Date().toISOString(), // Optional metadata
      };
  
      await signUp(formData.email, formData.password, profileData);
  
      toast.success("Account created successfully!");
      handleClose();
    } catch (error) {
      toast.error("Error creating account: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
      {/* <ToastContainer /> */}
      <IonContent className="flex items-cener justify-center">
        <IonGrid className="h-full max-w-2xl bg-gradient-to-t from-grean to-blue-300">
          <IonRow className="h-full">
            <IonCol size="12" className="ion-align-self-center">
              <IonCard className="">
                <IonCardHeader>
                  <IonCardTitle>
                    <IonText color="primary">
                      <h3 className="text-center text-[#75B657] mb-4">
                        Create Your Account
                      </h3>
                    </IonText>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem className="w-full">
                        <IonLabel position="stacked">Email</IonLabel>
                        <IonInput
                          name="email"
                          value={formData.email}
                          onIonChange={handleInputChange}
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </IonItem>
                    </IonCol>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Password</IonLabel>
                        <IonInput
                          name="password"
                          value={formData.password}
                          onIonChange={handleInputChange}
                          type="password"
                          placeholder="Enter your password"
                          required
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-padding">
                    <IonCol size="12" className="text-center">
                      <IonText className="text-center text-gray-500">
                        Already have an account?{" "}
                        <span
                          className="text-[#75B657] cursor-pointer"
                          onClick={toggleToSignin}
                        >
                          Sign In
                        </span>
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-justify-content-center max-w-sm mx-auto">
                    <IonCol size="6">
                      <IonButton
                        expand="block"
                        color="light"
                        onClick={handleGoogleSignUp}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <IonSpinner /> : "Sign in W/"}
                        <IonIcon slot="end" icon={logoGoogle} />
                      </IonButton>
                    </IonCol>
                    <IonCol size="6">
                      <IonButton
                        expand="block"
                        color="success"
                        onClick={handleSignUp}
                        disabled={isSubmitting}
                        className="text-white"
                      >
                        {isSubmitting ? <IonSpinner /> : "Sign Up"}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                  <IonRow className="">
                    <IonCol
                      size="12"
                      className="flex items-center justify-center pt-10"
                    >
                      <IonFabButton
                        expand="block"
                        color="danger"
                        onClick={handleClose}
                      >
                        <IonIcon icon={closeOutline} />
                      </IonFabButton>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
}

export default Signup;
