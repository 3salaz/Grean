import { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonModal,
  IonRow,
} from "@ionic/react";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import Background from "../../../assets/pexels-melissa-sombrerero-12605435.jpg";
import Signin from "../../Common/Signin";
import Signup from "../../Common/Signup";
import { useAuth } from "../../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { logoGoogle } from "ionicons/icons";
import { toast } from "react-toastify";

function Landing() {
  const { user } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { googleSignIn } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignin, setIsSignin] = useState(true); // default to SignIn

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openSigninModal = () => {
    setIsSignin(true);
    setIsAuthModalOpen(true);
  };
  const openSignupModal = () => {
    setIsSignin(false);
    setIsAuthModalOpen(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      toast.success("Signed in successfully with Google!");
      history.push("/account");
    } catch (error) {
      console.error(error);
      toast.error("Error signing in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonContent className="h-full w-full">
      <IonGrid className="h-full w-full p-0 m-0">
        <IonImg
          src={Background}
          alt="Woman sitting on a rock over a river."
          className="absolute top-0 object-cover h-full w-full"
        />
        <section className="mx-auto relative container max-w-2xl z-20 flex flex-col items-center gap-8 justify-center text-center h-full">
          <AnimatedTextWord text="GREAN" />
          <IonRow className="w-full">
            <IonCol size="8" className="mx-auto">
              <div className="w-full bg-transparent">
                  {user ? (
                    <IonButton
                      expand="block"
                      color="light"
                      onClick={() => history.push("/account")}
                    >
                      Account
                    </IonButton>
                  ) : (
                    <>
                      <IonButton
                        expand="block"
                        color="light"
                        onClick={handleGoogleSignIn}
                      >
                        Sign in W/
                        <IonIcon slot="end" icon={logoGoogle} />
                      </IonButton>
                      <IonButton
                        expand="block"
                        onClick={openSigninModal}
                      >
                        Sign In
                      </IonButton>
                    </>
                  )}
              </div>
            </IonCol>
          </IonRow>
        </section>
      </IonGrid>

      {/* Auth Modal: Toggles Signin or Signup */}
      <IonModal
        isOpen={isAuthModalOpen}
        onDidDismiss={closeAuthModal}
        backdropDismiss={true}
      >
        {isSignin ? (
          <Signin
            handleClose={closeAuthModal}
            toggleToSignup={openSignupModal}
          />
        ) : (
          <Signup
            handleClose={closeAuthModal}
            toggleToSignin={openSigninModal}
          />
        )}
      </IonModal>
    </IonContent>
  );
}

export default Landing;
