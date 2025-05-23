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
  IonPage,
  IonContent
} from "@ionic/react";
import { closeOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import Navbar from "../Layout/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path as needed

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
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();
  const { setProfile } = useProfile();

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

  const passwordsMatch = formData.password === formData.confirmPassword;

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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = await signUp(formData.email, formData.password);

      if (!user || !user.uid) {
        console.log("❌ Signup failed, user is undefined or missing UID:", user);
        toast.error("Signup failed. Please try again.");
        return;
      }

      console.log("✅ User signed up successfully:", user);

      // Poll for backend-created profile
      const profileRef = doc(db, "users", user.uid);
      let retries = 0;
      const maxRetries = 5;

      while (retries < maxRetries) {
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          const profileData = snap.data();
          setProfile(profileData);
          handleClose();
          history.push("/account");
          return;
        }
        retries++;
        await new Promise(r => setTimeout(r, 1000));
      }

      toast.error("Profile creation took too long. Try again later.");
    } catch (error) {
      console.error("❌ Sign Up Error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <IonGrid className="h-full w-full bg-gradient-to-t from-grean to-blue-300 flex items-end justify-center">
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
                      <IonText>Creating your account and profile...</IonText>
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
                          <IonButton
                            fill="clear"
                            slot="end"
                            className="ion-align-self-end"
                            onClick={togglePasswordVisibility}
                          >
                            <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                          </IonButton>
                          <IonInput
                            name="password"
                            value={formData.password}
                            onIonChange={handleInputChange}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                          />
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

                    {/* Sign Up Button */}
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

                    <IonRow className="ion-padding-top">
                      <IonCol size="auto" className="mx-auto">
                        <IonButton shape="round" size="small" color="danger" onClick={handleClose}>
                          <IonIcon slot="icon-only" icon={closeOutline} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default Signup;
