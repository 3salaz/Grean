import React, {useState, useMemo, useEffect} from "react";
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
  IonCardContent,
  IonFabButton,
  IonIcon
} from "@ionic/react";
import {closeOutline} from "ionicons/icons";
import {useAuth} from "../../context/AuthContext";
import {useProfile} from "../../context/ProfileContext";
import {useHistory} from "react-router-dom";

interface SigninProps {
  handleClose: () => void;
  toggleToSignup: () => void;
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Signin: React.FC<SigninProps> = ({handleClose, toggleToSignup}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const history = useHistory(); // Initialize history
  const {signIn} = useAuth();
  const {profile} = useProfile();

  // Handles input changes to update state
  const handleInputChange = (e: any) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if the form is valid (both fields filled & valid email)
  const isFormValid = useMemo(() => {
    const {email, password} = formData;
    return email.trim() !== "" && password.trim() !== "" && isValidEmail(email);
  }, [formData]);

  const handleSignIn = async () => {
    const {email, password} = formData;

    if (!isFormValid) {
      console.error("Invalid email or missing password.");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      handleClose();
      history.push("/account"); // Redirect to account page
    } catch (error) {
      console.error("Error signing in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonGrid className="h-full w-full bg-gradient-to-t from-grean to-blue-300 flex items-end justify-center">
      <div className="container m-4 h-[80%]">
        <IonCard className="py-10">
          <IonCardHeader>
            <IonText color="primary">
              <h3 className="text-center text-[#75B657] mb-4">Sign In To Your Account</h3>
            </IonText>
          </IonCardHeader>
          <IonCardContent>
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

            {/* Not a member? */}
            <IonRow className="ion-padding">
              <IonCol size="12" className="text-center">
                <IonText className="text-center text-gray-500">
                  Not a member?{" "}
                  <span className="text-[#75B657] cursor-pointer" onClick={toggleToSignup}>
                    Sign Up
                  </span>
                </IonText>
              </IonCol>
            </IonRow>

            {/* Sign In Button - Disabled if form invalid */}
            <IonRow className="ion-justify-content-center max-w-sm mx-auto">
              <IonCol size="auto">
                <IonButton
                  expand="block"
                  color="success"
                  onClick={handleSignIn}
                  disabled={!isFormValid || loading}
                >
                  {loading ? <IonSpinner name="crescent" /> : "Sign In"}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        {/* Close Button */}
        <IonRow>
          <IonCol size="12" className="flex items-center justify-center pt-2">
            <IonFabButton color="danger" onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonFabButton>
          </IonCol>
        </IonRow>
      </div>
    </IonGrid>
  );
};

export default Signin;
