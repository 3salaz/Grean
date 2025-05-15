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
  IonIcon
} from "@ionic/react";
import { closeOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";

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
  const history = useHistory(); // Initialize history
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggles for show/hide password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Grab signUp from AuthContext
  const { signUp } = useAuth();
  const { createProfile, setProfile } = useProfile();
  // const {createProfile} = useProfile(); // Get createProfile function

  const handleInputChange = (e: CustomEvent<{ value: string }>) => {
    const input = e.target as HTMLInputElement;
    const { name } = input;
    const { value } = e.detail;

    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleSubmit = async () => {
    setIsSubmitting(true); // Start loading state
    try {
      const user = await signUp(formData.email, formData.password);

      if (!user || !user.uid) {
        console.log("❌ Signup failed, user is undefined or missing UID:", user);
        toast.error("Signup failed. Please try again.");
        return;
      }

      console.log("✅ User signed up successfully:", user);
      const newProfile = {
        displayName: `user${Math.floor(Math.random() * 10000)}`,
        email: user.email || "",
        photoURL: "",
        uid: user.uid,
        locations: [],
        pickups: [],
        accountType: "" // Initial empty accountType
      };

      createProfile(newProfile).then(() => {
        setProfile(newProfile);
      });

      handleClose(); // Close modal after success
      history.push("/account"); // Redirect to account page
    } catch (error) {
      console.error("❌ Sign Up Error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  return (
    <IonGrid className="h-full w-full bg-gradient-to-t from-grean to-blue-300 flex items-end justify-center">
      <ToastContainer />
      <div className="container m-4 h-[80%]">
        <IonCard className="py-10 shadow-none">
          <IonCardHeader>
            <IonCardTitle>
              <IonText color="primary">
                <h3 className="text-center text-[#75B657] mb-4">Create Your Account</h3>
              </IonText>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {isSubmitting ? (
              <IonRow className="ion-justify-content-center ion-padding">
                <IonCol size="12" className="ion-text-center">
                  <IonSpinner />
                  <IonText>Creating user account...</IonText>
                </IonCol>
              </IonRow>
            ) : (
              <>
                {/* Email Field */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem
                      color={formData.email && !isValidEmail(formData.email) ? "danger" : undefined}
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
                      color={formData.confirmPassword && !passwordsMatch ? "danger" : undefined}
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
                      <span className="text-[#75B657] cursor-pointer" onClick={toggleToSignin}>
                        Sign In
                      </span>
                    </IonText>
                  </IonCol>
                </IonRow>

                {/* Sign Up Button - Disabled if form invalid */}
                <IonRow className="ion-justify-content-center max-w-sm mx-auto">
                  <IonCol size="auto">
                    <IonButton
                      expand="block"
                      color="success"
                      size="small"
                      onClick={handleSubmit}
                      disabled={!isFormValid || isSubmitting}
                      className="text-white"
                    >
                      {isSubmitting ? <IonSpinner /> : "Sign Up"}
                    </IonButton>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12" className="flex items-center justify-center pt-2">
                    <IonFabButton size="small" color="danger" onClick={handleClose}>
                      <IonIcon icon={closeOutline} />
                    </IonFabButton>
                  </IonCol>
                </IonRow>
              </>
            )}
          </IonCardContent>
        </IonCard>
      </div>
    </IonGrid>
  );
}

export default Signup;
