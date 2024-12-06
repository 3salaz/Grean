import { useState } from "react";
import { IonButton, IonContent, IonImg, IonModal } from "@ionic/react";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import Background from "../../../assets/pexels-melissa-sombrerero-12605435.jpg";
import Signin from "../../Common/Signin";
import Signup from "../../Common/Signup";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import { useHistory } from "react-router-dom";

function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignin, setIsSignin] = useState(true); // Toggle between Signin and Signup
  const { user } = useAuthProfile();
  const history = useHistory();


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
    <IonContent className="relative flex justify-center items-center h-full w-full">
      <main className="w-full h-full">
        <IonImg
          src={Background}
          alt="Woman sitting atop a rock edge which is extending outwards over a river."
          className="absolute top-0 object-cover h-full w-full"
        />
        <section className="relative z-20 flex flex-col items-center gap-8 justify-center text-center h-full w-full">
          <AnimatedTextWord text="GREAN" />
          <div className="w-full items-center justify-center flex flex-col gap-2">
            {user ? (
              <IonButton
                expand="block"
                color="light"
                onClick={() => history.push("/account")}
              >
                Account
              </IonButton>
            ) : (
              <IonButton
                expand="block"
                color="white"
                onClick={openSigninModal}
                className="bg-grean rounded-md"
              >
                Sign In
              </IonButton>
            )}
          </div>
        </section>
      </main>

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
