import { useState, useMemo } from "react";
import type { InputCustomEvent } from "@ionic/core";
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
  IonPage,
  IonContent,
  IonSelect,
  IonSelectOption
} from "@ionic/react";

import { motion } from "framer-motion";
import { closeOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { sendEmailVerification } from "firebase/auth"; // add this import

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password: string) => password.length >= 6;

interface SignupProps {
  handleClose: () => void;
  toggleToSignin: () => void;
  triggerForgotPassword: () => void;
}

function Signup({ handleClose, toggleToSignin, triggerForgotPassword }: SignupProps) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "User",

  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();

  const handleInputChange = (name: string, value: string | null | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  const isFormValid = useMemo(() => {
    const { email, password, confirmPassword, accountType } = formData;
    return (
      email &&
      password &&
      confirmPassword &&
      isValidEmail(email) &&
      isValidPassword(password) &&
      passwordsMatch &&
      accountType
    );
  }, [formData, passwordsMatch]);



  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = await signUp(formData.email, formData.password, formData.accountType);

      if (!user?.uid) throw new Error("No user UID");

      // 🔐 Send verification email
      if (user && user.emailVerified === false) {
        await sendEmailVerification(user);
        toast.info("A verification email has been sent. Please verify your email soon.");
      }

      handleClose();
      history.push("/");
    } catch (error) {
      console.error("❌ Sign Up Error:", error);
      toast.error("There was a problem creating your account.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <IonPage>
      <IonContent fullscreen className="flex flex-col items-center justify-center p-4 bg-transparent">
        <ToastContainer />
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
            className="ion-padding max-w-lg w-full mx-auto rounded-md p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <IonRow>
              <IonCol size="12" className="text-center">
                <h3 className="text-xl font-semibold text-[#75B657]">Create Your Account</h3>
              </IonCol>
            </IonRow>

            {loading ? (

              <IonRow className="ion-justify-content-center ion-align-items-center ion-padding">
                <IonCol size="12" className="flex flex-col justify-center items-center gap-4">
                  <IonSpinner name="crescent" color="primary" />
                  <IonText>Creating your account and profile...</IonText>
                </IonCol>
              </IonRow>

            ) : (
              <>
                {/* Email */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem className="bg-white/20 backdrop-blur-md rounded-md">
                      <IonLabel position="stacked">Email</IonLabel>
                      <IonInput
                        name="email"
                        value={formData.email}
                        onIonChange={(e) => handleInputChange("email", e.detail.value)}
                        type="email"
                        placeholder="Enter your email"
                      />
                    </IonItem>
                    {formData.email && !isValidEmail(formData.email) && (
                      <IonText color="danger" className="text-sm">Invalid email format.</IonText>
                    )}
                  </IonCol>
                </IonRow>

                {/* Password */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem className="bg-white/20 backdrop-blur-md rounded-md mt-2">
                      <IonLabel position="stacked">Password</IonLabel>
                      <IonInput
                        name="password"
                        value={formData.password}
                        onIonChange={(e) => handleInputChange("password", e.detail.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <IonButton
                        fill="clear"
                        slot="end"
                        className="ion-align-self-end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                      </IonButton>
                    </IonItem>
                    {formData.password && !isValidPassword(formData.password) && (
                      <IonText color="danger" className="text-sm">
                        Password must be at least 6 characters.
                      </IonText>
                    )}
                  </IonCol>
                </IonRow>

                {/* Confirm Password */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem className="bg-white/20 backdrop-blur-md rounded-md mt-2">
                      <IonLabel position="stacked">Confirm Password</IonLabel>
                      <IonButton
                        fill="clear"
                        slot="end"
                        className="ion-align-self-end"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                      </IonButton>
                      <IonInput
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onIonChange={(e) => handleInputChange("confirmPassword", e.detail.value)}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                      />
                    </IonItem>
                    {formData.confirmPassword && !passwordsMatch && (
                      <IonText color="danger" className="text-sm">
                        Passwords do not match.
                      </IonText>
                    )}
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem className="bg-white/20 backdrop-blur-md rounded-md mt-2 w-full">
                      <IonLabel position="stacked">Account Type</IonLabel>
                      <IonSelect
                        value={formData.accountType}
                        placeholder="Accoount Type"
                        onIonChange={(e) => handleInputChange("accountType", e.detail.value)}
                        className="w-full"
                      >
                        <IonSelectOption value="User">User</IonSelectOption>
                        <IonSelectOption value="Driver">Driver</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>




                {/* Submit */}
                <IonRow className="mt-2 ion-padding-horizontal">
                  <IonCol size="auto" className="text-center">
                    <IonButton
                      expand="block"
                      fill="solid"
                      color="primary"
                      size="small"
                      onClick={handleSubmit}
                    >
                      {loading ? <IonSpinner /> : "Sign Up"}
                    </IonButton>
                  </IonCol>
                </IonRow>

                {/* Switch to Signin */}
                <IonRow className="mt-4 ion-padding">
                  <IonCol size="12" className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <span className="text-[#75B657] font-medium cursor-pointer" onClick={toggleToSignin}>
                      Sign In
                    </span>
                  </IonCol>
                </IonRow>
              </>
            )}
          </motion.main>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default Signup;
