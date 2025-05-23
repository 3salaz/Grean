import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonModal,
  IonPage,
  IonRow,
} from "@ionic/react";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import Background from "../../../assets/grean-bg.webp";
import Signin from "../../Common/Signin";
import Signup from "../../Common/Signup";
import { useAuth } from "../../../context/AuthContext";
import { useHistory } from "react-router-dom";

function Landing() {
  const { user } = useAuth();
  const history = useHistory();
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

  return (

    <IonGrid className="h-full w-full">
      <IonImg
        src={Background}
        alt="Woman sitting on a rock over a river."
        className="absolute top-0 object-cover h-full w-full"
      />
      <section className="mx-auto relative container max-w-2xl z-20 flex flex-col items-center gap-8 justify-center text-center p-0 h-full">
        <AnimatedTextWord text="GREAN" />
        <IonRow className="w-full">
          {user ? (
            <IonCol size="auto" className="ion-align-self-center mx-auto">
              <IonButton
                expand="block"
                color="light"
                size="small"
                onClick={() => history.push("/account")}
              >
                Account
              </IonButton>
            </IonCol>
          ) : (
            <IonCol size="auto" className="ion-align-self-center mx-auto">
              {/* <IonButton
                        color="light"
                        shape="square"
                        onClick={handleGoogleSignIn}
                      >
                        <IonIcon slot="icon-only" icon={logoGoogle} />
                      </IonButton> */}
              <IonButton
                expand="block"
                size="small"
                onClick={openSigninModal}
              >
                Sign In
              </IonButton>
              {/* <IonText onClick={handleGoogleSignIn} className="cursor-pointer text-xs font-bold text-center text-grean">or sign in with Google</IonText> */}
            </IonCol>
          )}
        </IonRow>
      </section>

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
    </IonGrid>
  );
}

export default Landing;
