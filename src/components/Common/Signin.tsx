import React, { useState, useMemo } from "react";
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
  IonIcon,
  IonContent,
  IonPage,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";

interface SigninProps {
  handleClose: () => void;
  toggleToSignup: () => void;
  triggerForgotPassword: () => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signin: React.FC<SigninProps> = ({ handleClose, toggleToSignup, triggerForgotPassword }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { signIn } = useAuth();
  const { profile } = useProfile();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = useMemo(() => {
    const { email, password } = formData;
    return email.trim() !== "" && password.trim() !== "" && isValidEmail(email);
  }, [formData]);

  const handleSignIn = async () => {
    const { email, password } = formData;
    if (!isFormValid) return console.error("Invalid email or missing password.");
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
    <IonPage>
      <ToastContainer/>
      <IonContent fullscreen className="flex flex-col items-center justify-center p-4 bg-transparent">
        <IonGrid className="max-w-xl w-full mx-auto h-full flex flex-col justify-center">
          <header className="absolute right-0 top-0">
            <IonRow className="justify-end">
              <IonCol size="auto">
                <IonButton fill="clear" color="medium" onClick={handleClose}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          </header>
          <motion.main className="ion-padding max-w-lg w-full mx-auto" initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}>

            <IonRow>
              <IonCol size="12" className="text-center">
                <h3 className="text-xl font-semibold text-[#75B657]">Sign In</h3>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12">
                <IonItem className="bg-white/20 backdrop-blur-md rounded-md">
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    name="email"
                    value={formData.email}
                    onIonChange={handleInputChange}
                    type="email"
                    placeholder="you@example.com"
                  />
                </IonItem>
                {formData.email && !isValidEmail(formData.email) && (
                  <IonText color="danger" className="text-sm">Invalid email format.</IonText>
                )}
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12">
                <IonItem className="bg-white/20 backdrop-blur-md rounded-md mt-2">
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput
                    name="password"
                    value={formData.password}
                    onIonChange={handleInputChange}
                    type="password"
                    placeholder="Your password"
                  />
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow className="mt-2 ion-padding-horizontal">
              <IonCol size="auto" className="text-center">
                <IonButton
                size="small"
                  color="success"
                  disabled={!isFormValid || loading}
                  onClick={handleSignIn}
                >
                  {loading ? <IonSpinner name="crescent" /> : "Sign In"}
                </IonButton>
              </IonCol>
            </IonRow>

            <IonRow className="mt-2">
                  <IonCol size="12" className="text-center text-sm text-gray-600">
                    Forgot your password?{" "}
                    <span
                      className="text-[#75B657] font-medium cursor-pointer"
                      onClick={triggerForgotPassword}
                    >
                      Reset it here
                    </span>
                  </IonCol>
                </IonRow>

            <IonRow className="mt-4">
              <IonCol size="12" className="text-center text-sm text-gray-600">
                Not a member?{" "}
                <span className="text-[#75B657] font-medium cursor-pointer" onClick={toggleToSignup}>
                  Sign Up
                </span>
              </IonCol>
            </IonRow>
          </motion.main>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Signin;
