import { useState, useMemo } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext"; // Import the Profile contexts
import { getFunctions, httpsCallable } from "firebase/functions";
// import { app } from "../../firebase"; // Adjust based on your Firebase config location

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
  const { createProfile } = useProfile(); // Get createProfile function

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
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleSignUp = async () => {
    console.log("🟢 handleSignUp called!");

    try {
      const userCredential = await signUp(formData.email, formData.password);

      console.log("✅ Firebase signUp response:", userCredential);

      // Fix: Check if userCredential is valid and properly structured
      const user = userCredential?.user || userCredential; // Ensure we get the user object

      if (!user || !user.uid) {
        console.error(
          "❌ Signup failed, user is undefined or missing UID:",
          user
        );
        toast.error("Signup failed. Please try again.");
        return;
      }

      console.log("✅ User signed up successfully:", user);

      console.log("🔥 Calling createProfile for UID:", user.uid);
      await createProfile({
        displayName: user.displayName || "user",
        profilePic: user.photoURL || null,
        email: user.email || "",
        uid: user.uid,
        locations: [],
        pickups: [],
        accountType: "User",
      });

      console.log("✅ Profile should be created now.");

      handleClose(); // Close modal after success
    } catch (error) {
      console.error("❌ Sign Up Error:", error);
      toast.error("Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonGrid className="h-full w-full bg-gradient-to-t from-grean to-blue-300 flex items-end justify-center">
      <div className="container m-4 h-[80%]">
      <IonCard className="py-10">
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
                <IonButton
                  fill="clear"
                  slot="end"
                  className="ion-align-self-end"
                  onClick={togglePasswordVisibility}
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
                <IonButton
                  fill="clear"
                  slot="end"
                  className="ion-align-self-end"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <IonIcon
                    icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                  />
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
        </IonCardContent>
      </IonCard>
      <IonRow>
            <IonCol
              size="12"
              className="flex items-center justify-center pt-2"
            >
              <IonFabButton color="danger" onClick={handleClose}>
                <IonIcon icon={closeOutline} />
              </IonFabButton>
            </IonCol>
      </IonRow>
      </div>
    </IonGrid>
  );
}

export default Signup;
