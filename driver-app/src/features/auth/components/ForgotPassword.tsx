import { useState, useMemo } from "react";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
  IonIcon,
  IonPage,
  IonSpinner
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface ForgotPasswordProps {
  handleClose: () => void;
  toggleToSignin: () => void;
  toggleToSignup: () => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ handleClose, toggleToSignin, toggleToSignup }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const isFormValid = useMemo(() => email && isValidEmail(email), [email]);

  const handleReset = async () => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      await resetPassword(email);
    } catch (error) {
      // error toast is handled in context
    } finally {
      setLoading(false);
      toggleToSignin
      handleClose();
    }
    
  };

  return (
    <IonPage>
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

          <motion.main
            className="ion-padding max-w-lg w-full mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <IonRow>
              <IonCol size="12" className="text-center">
                <h3 className="text-xl font-semibold text-[#75B657]">Reset Password</h3>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12">
                <IonItem className="bg-white/20 backdrop-blur-md rounded-md mt-4">
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                  />
                </IonItem>
                {email && !isValidEmail(email) && (
                  <IonText color="danger" className="text-sm">Invalid email format.</IonText>
                )}
              </IonCol>
            </IonRow>

            <IonRow className="mt-4 ion-padding-horizontal">
              <IonCol size="auto" className="text-center">
                <IonButton
                  size="small"
                  color="success"
                  disabled={!isFormValid || loading}
                  onClick={handleReset}
                >
                  {loading ? <IonSpinner name="crescent" /> : "Send Reset Link"}
                </IonButton>
              </IonCol>
            </IonRow>

            <IonRow className="mt-4">
              <IonCol size="12" className="text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <span className="text-[#75B657] font-medium cursor-pointer" onClick={toggleToSignin}>
                  Sign In
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

export default ForgotPassword;
