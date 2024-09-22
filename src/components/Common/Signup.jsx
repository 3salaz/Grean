import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { toast } from "react-toastify";
import {
  IonContent,
  IonPage,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonFabButton,
} from "@ionic/react";
import { motion } from "framer-motion";
import { closeOutline, logoGoogle } from "ionicons/icons";

function Signup({ handleClose }) {
  const history = useHistory();
  const { user, signUp, googleSignIn } = useAuthProfile();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({ ...prevData, email: user.email }));
    }
  }, [user]);

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
      console.log("Signed up successfully with Google!");
      handleClose();
      history.push("/account");
    } catch (error) {
      console.log(error);
      toast.error("Error signing up with Google. Please try again.");
    }
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const profileData = {
        displayName: "",
        email: formData.email,
        addresses: [],
        stats: {
          overall: 0,
          pickups: [],
        },
      };
      await signUp(formData.email, formData.password, profileData);
      console.log("User created successfully!");
      handleClose();
      history.push("/account");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Error: Email already in use.");
      } else {
        toast.error("Error creating user: " + error.message);
      }
    }
  };

  return (
    <IonContent className="flex items-center justify-center">
      <IonGrid className="h-[92svh] max-w-xl">
        <IonRow className="h-full">
          <IonCol size="12" className="ion-align-self-center">
            <IonCard className="shadow-none">
              <IonCardHeader>
                <IonCardTitle>
                  <IonText color="primary">
                    <h3 className="text-center text-[#75B657] mb-4">
                      Sign Up for an Account
                    </h3>
                  </IonText>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
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
                  <IonRow>
                    <IonCol size="12" className="text-center ion-padding">
                        <IonText className="text-center text-sm text-gray-500">
                          Already a member?{" "}
                          <Link
                            to="/"
                            className="pl-1 font-semibold leading-6 text-[#75B657] hover:text-green-700"
                          >
                            Sign In
                          </Link>
                        </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="6">
                      <IonButton
                        expand="block"
                        color="light"
                        size="medium"
                        onClick={handleGoogleSignUp}
                        className="flex items-center"
                      >
                        Sign Up W/
                        <IonIcon slot="end" icon={logoGoogle} />
                      </IonButton>
                    </IonCol>
                    <IonCol size="6">
                      <IonButton
                        expand="block"
                        color="success"
                        onClick={handleSignUp}
                        className="text-white"
                      >
                        Sign Up
                      </IonButton>
                    </IonCol>
                  </IonRow>                
                  <IonRow>
                    <IonCol
                      size="12"
                      className="flex items-center justify-center pt-10"
                    >
                      <IonFabButton
                        expand="block"
                        color="danger"
                        onClick={handleClose}
                        className="text-white"
                      >
                        <IonIcon icon={closeOutline} />
                      </IonFabButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}

export default Signup;
