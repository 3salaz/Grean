import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonSpinner,
  IonCardContent,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonFabButton,
} from "@ionic/react";
import { toast, ToastContainer } from "react-toastify";
import { closeOutline, logoGoogle } from "ionicons/icons";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

function Signin({ handleClose, toggleToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, googleSignIn } = useAuth();
  const history = useHistory();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      handleClose();
      history.push("/account");
    } catch (error) {
      console.error("Error signing in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <IonGrid className="h-full w-full bg-gradient-to-t from-grean to-blue-300">
          <IonRow className="h-full p-0 m-0 w-full">
            <IonCol size="12" className="ion-align-self-center">
              <IonCard className="h-full m-0">
                <IonCardHeader>
                  <IonText color="primary">
                    <h3 className="text-center text-[#75B657] mb-4">
                      Sign In To Your Account
                    </h3>
                  </IonText>
                </IonCardHeader>
                <IonCardContent>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem className="w-full">
                        <IonLabel position="stacked">Email</IonLabel>
                        <IonInput
                          value={email}
                          onIonChange={(e) => setEmail(e.detail.value)}
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </IonItem>

                      </IonCol>
                      <IonCol size="12">
                        <IonItem className="w-full">
                          <IonLabel position="stacked">Password</IonLabel>
                          <IonInput
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value)}
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
                        Not a member?{" "}
                        <span
                          className="text-[#75B657] cursor-pointer"
                          onClick={toggleToSignup}
                        >
                          Sign Up
                        </span>
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-justify-content-center max-w-sm mx-auto">
                    <IonCol size="6">
                      <IonButton
                        expand="block"
                        color="success"
                        onClick={handleSignIn}
                        disabled={loading}
                      >
                        {loading ? <IonSpinner name="crescent" /> : "Sign In"}
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
  );
}

export default Signin;
