import { useState} from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuthProfile } from "../../context/AuthProfileContext";
import {
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { toast } from "react-toastify";
import { logoGoogle } from "ionicons/icons";

// Debounce function

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, googleSignIn } = useAuthProfile();
  const history = useHistory();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      console.log("Signed in successfully with Google!");
      history.push("/account");
    } catch (error) {
      console.log(error);
      toast.error("Error signing in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      console.log("Signed in successfully!");
      history.push("/account");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email and try again.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error(
          "Error signing in. Please check your credentials and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[90%] max-w-[650px] bg-white">
      <main className="w-full rounded-lg p-2">
        <div className="flex flex-col items-center">
          <IonText color="primary">
            <h3 className="text-center text-[#75B657] mb-4">
              Sign In To Your Account
            </h3>
          </IonText>
          <section className="w-full flex flex-col gap-4 items-center">
            <IonItem className="w-full">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={email}
                onIonChange={(e) => setEmail(e.detail.value)}
                type="email"
                className="w-full"
                placeholder="Enter your email"
                required
              />
            </IonItem>
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
            <IonText className="text-center text-sm text-gray-500 w-full">
              Not a member?
              <Link
                to="/setup"
                className="pl-1 font-semibold leading-6 text-[#75B657] hover:text-green-700"
              >
                Sign Up
              </Link>
            </IonText>
          </section>
          <div className="flex items-center justify-center gap-4 mt-4">
            <IonButton
              expand="block"
              color="light"
              onClick={handleGoogleSignIn}
              className="flex items-center"
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : <IonIcon slot="start" icon={logoGoogle} />}
              Sign in with Google
            </IonButton>
            <IonButton
              expand="block"
              color="success"
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : "Sign In"}
            </IonButton>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signin;
