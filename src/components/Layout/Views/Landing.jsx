import { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonButton, IonContent, IonImg, IonModal } from "@ionic/react";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import Background from "../../../assets/pexels-melissa-sombrerero-12605435.jpg";
import Signin from "../../Common/Signin";
import { useAuthProfile } from "../../../context/AuthProfileContext";

function Landing() {
  const [signInModalOpen, setSigninModalOpen] = useState(false);
  const { user } = useAuthProfile();
  const history = useHistory();

  const closeSigninModal = () => setSigninModalOpen(false);
  const openSigninModal = () => setSigninModalOpen(true);

  const navigateTo = (route) => {
    history.push(`/${route}`);
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
                onClick={() => navigateTo('account')}
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
            {/* <IonButton expand="block" color="white" className="bg-white text-grean rounded-md">
              Browse
            </IonButton> */}
          </div>
        </section>
      </main>


      <IonModal isOpen={signInModalOpen} onDidDismiss={closeSigninModal}>
        <Signin handleClose={closeSigninModal} />
      </IonModal>

    </IonContent>
  );
}

export default Landing;
