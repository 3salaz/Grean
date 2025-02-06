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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFabButton,
  IonIcon,
  IonContent,
} from "@ionic/react";
import { closeOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string) => {
  return password.length >= 6;
};

interface SignupProps {
  handleClose: () => void;
  toggleToSignin: () => void;
}

function Signup({ handleClose, toggleToSignin }: SignupProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggles for show/hide password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Grab signUp from AuthContext
  const { signUp } = useAuth();

  // Handler for text input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if passwords match in real-time
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Use useMemo or a direct boolean expression
  // isFormValid = fields are non-empty, email is valid, password is valid, and passwords match
  const isFormValid = useMemo(() => {
    const { email, password, confirmPassword } = formData;
    return (
      email &&
      password &&
      confirmPassword &&
      isValidEmail(email) &&
      isValidPassword(password) &&
      passwordsMatch
    );
  }, [formData, passwordsMatch]);

  // Show/hide password text
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSignUp = async () => {
    const { email, password, confirmPassword } = formData;

    // Final check before submitting, or you can rely on isFormValid
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!passwordsMatch) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email, password);
      // AuthContext will show success or error toasts
      handleClose();
    } catch (error: any) {
      // AuthContext already showed an error toast
      console.error("Sign Up Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <IonGrid className="h-full max-w-2xl bg-gradient-to-t from-grean to-blue-300">
        <IonRow className="h-full">
          <IonCol size="12" className="ion-align-self-center">
            <IonCard>
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
                {/* Email Field */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem
                      color={
                        formData.email && !isValidEmail(formData.email)
                          ? "danger"
                          : undefined
                      }
                    >
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
                    {formData.email && !isValidEmail(formData.email) && (
                      <IonText color="danger" className="text-sm">
                        Invalid email format.
                      </IonText>
                    )}
                  </IonCol>
                </IonRow>

                {/* Password Field */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem
                      color={
                        formData.password && !isValidPassword(formData.password)
                          ? "danger"
                          : undefined
                      }
                    >
                      <IonLabel position="stacked">Password</IonLabel>
                      <IonInput
                        name="password"
                        value={formData.password}
                        onIonChange={handleInputChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                      />
                      <IonButton fill="clear" slot="end" onClick={togglePasswordVisibility}>
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

                {/* Confirm Password Field */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem
                      color={
                        formData.confirmPassword && !passwordsMatch
                          ? "danger"
                          : undefined
                      }
                    >
                      <IonLabel position="stacked">Confirm Password</IonLabel>
                      <IonInput
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onIonChange={handleInputChange}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        required
                      />
                      <IonButton fill="clear" slot="end" onClick={toggleConfirmPasswordVisibility}>
                        <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                      </IonButton>
                    </IonItem>
                    {formData.confirmPassword && !passwordsMatch && (
                      <IonText color="danger" className="text-sm">
                        Passwords do not match.
                      </IonText>
                    )}
                  </IonCol>
                </IonRow>

                {/* Already have an account? */}
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

                {/* Sign Up Button - Disabled if form invalid */}
                <IonRow className="ion-justify-content-center max-w-sm mx-auto">
                  <IonCol size="12">
                    <IonButton
                      expand="block"
                      color="success"
                      onClick={handleSignUp}
                      disabled={!isFormValid || isSubmitting}
                      className="text-white"
                    >
                      {isSubmitting ? <IonSpinner /> : "Sign Up"}
                    </IonButton>
                  </IonCol>
                </IonRow>

                {/* Close button */}
                <IonRow>
                  <IonCol size="12" className="flex items-center justify-center pt-10">
                    <IonFabButton color="danger" onClick={handleClose}>
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

export default Signup;
