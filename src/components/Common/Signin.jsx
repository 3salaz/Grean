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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      toast.success("Signed in successfully with Google!");
      handleClose();
      history.push("/account");
    } catch (error) {
      console.error(error);
      toast.error("Error signing in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      toast.success("Signed in successfully!");
      handleClose();
      history.push("/account");
    } catch (error) {
      toast.error("Error signing in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <IonContent className="flex items-center justify-center">
        <IonGrid className="h-full max-w-2xl bg-gradient-to-t from-grean to-blue-300">
          <IonRow className="h-full">
            <IonCol size="12" className="ion-align-self-center">
              <IonCard className="shadow-none">
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
                        color="light"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                      >
                        {loading ? (
                          <IonSpinner name="crescent" />
                        ) : (
                          "Sign in W/"
                        )}
                        <IonIcon slot="end" icon={logoGoogle} />
                      </IonButton>
                    </IonCol>
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
      </IonContent>
    </>
  );
}

export default Signin;
