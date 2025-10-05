import {useState} from "react";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonModal,
  IonPage,
  IonRow
} from "@ionic/react";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import Background from "../../../assets/grean-driver-bg.jpg";
import Signin from "../../Common/Signin";
import Signup from "../../Common/Signup";
import {useAuth} from "../../../context/AuthContext";
import {useHistory} from "react-router-dom";
import ForgotPassword from "../../Common/ForgotPassword";

function Landing() {
  const {user} = useAuth();
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

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <IonGrid className="h-full w-full">
      <IonImg
        src={Background}
        alt="Woman sitting on a rock over a river."
        className="absolute top-0 object-cover h-full w-full"
      />
      <section className="mx-auto relative container max-w-2xl z-20 flex flex-col items-center gap-8 justify-center text-center p-0 h-full">
        <AnimatedTextWord text="GREAN" />
        <span className="text-lg md:text-base font-bold text-blue-500 drop-shadow-lg bg-white rounded-full px-2">
          Driver
        </span>

        <IonRow className="w-full bottom-20 absolute">
          {user ? (
            <IonCol size="6" className="ion-align-self-center mx-auto">
              <IonButton expand="block" color="light" onClick={() => history.push("/account")}>
                Account
              </IonButton>
            </IonCol>
          ) : (
            <IonCol size="6" className="ion-align-self-center mx-auto">
              {/* <IonButton
                        color="light"
                        shape="square"
                        onClick={handleGoogleSignIn}
                      >
                        <IonIcon slot="icon-only" icon={logoGoogle} />
                      </IonButton> */}
              <IonButton color="tertiary" expand="block" onClick={openSigninModal}>
                Sign In
              </IonButton>
              {/* <IonText onClick={handleGoogleSignIn} className="cursor-pointer text-xs font-bold text-center text-grean">or sign in with Google</IonText> */}
            </IonCol>
          )}
        </IonRow>
      </section>

      <IonModal isOpen={isAuthModalOpen} onDidDismiss={closeAuthModal} backdropDismiss={true}>
        {showForgotPassword ? (
          <ForgotPassword
            handleClose={closeAuthModal}
            toggleToSignin={() => {
              setShowForgotPassword(false);
              openSigninModal();
            }}
            toggleToSignup={() => {
              setShowForgotPassword(false);
              openSignupModal();
            }}
          />
        ) : isSignin ? (
          <Signin
            handleClose={closeAuthModal}
            toggleToSignup={openSignupModal}
            triggerForgotPassword={() => setShowForgotPassword(true)}
          />
        ) : (
          <Signup
            handleClose={closeAuthModal}
            toggleToSignin={openSigninModal}
            triggerForgotPassword={() => setShowForgotPassword(true)}
          />
        )}
      </IonModal>
    </IonGrid>
  );
}

export default Landing;
