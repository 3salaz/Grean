import { useState } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.svg";
import { Link } from "react-router-dom";
import Signup from "../Common/Signup";
import Signin from "../Common/Signin"; // if you want to show sign in from navbar
import {
  IonModal,
  IonPopover,
  IonButton,
  IonIcon,
  IonToolbar,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonText,
  IonCol,
  IonRow,
  IonHeader,
} from "@ionic/react";
import { logOutOutline, menuOutline } from "ionicons/icons";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logOut } = useAuth();

  // Dropdown popover states
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);

  // Another popover for routes
  const [isRoutesPopoverOpen, setIsRoutesPopoverOpen] = useState(false);
  const [routesPopoverEvent, setRoutesPopoverEvent] = useState<any>(null);

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignin, setIsSignin] = useState(false);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await logOut();
      console.log("You are logged out");
      setIsPopoverOpen(false);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  // Account popover
  const handleOpenPopover = (event: any) => {
    event.persist();
    setPopoverEvent(event);
    setIsPopoverOpen(true);
  };
  const handleClosePopover = () => setIsPopoverOpen(false);

  // Routes popover
  const handleOpenRoutesPopover = (event: any) => {
    event.persist();
    setRoutesPopoverEvent(event);
    setIsRoutesPopoverOpen(true);
  };
  const handleCloseRoutesPopover = () => setIsRoutesPopoverOpen(false);

  // AUTH MODAL
  const openSignupModal = () => {
    setIsSignin(false);
    setIsAuthModalOpen(true);
  };
  const openSigninModal = () => {
    setIsSignin(true);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <IonHeader className="ion-no-border ion-no-padding">
      <IonToolbar color="primary" className="h-full" id="navbar">
        <IonRow className="ion-justify-content-between ion-no-padding m-0 p-0">
          {/* Menu Button */}
          <IonCol color="light" className="ion-align-self-center mx-auto">
            <IonButton fill="clear" onClick={handleOpenRoutesPopover}>
              <IonIcon color="light" size="large" icon={menuOutline}></IonIcon>
            </IonButton>
          </IonCol>

          {/* Logo Section */}
          <IonCol className="ion-align-self-center flex items-center justify-center">
            <Link to="/">
              <img className="h-10 w-10 rounded-full" src={logo} alt="Grean Logo" />
            </Link>
          </IonCol>

          {/* Account / Profile */}
          <IonCol className="ion-align-self-center flex items-center justify-end">
            {user ? (
              <>
                {/* If logged in, show avatar & popover */}
                <IonButton fill="clear" onClick={handleOpenPopover}>
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.photoURL || avatar}
                    alt="User Avatar"
                  />
                </IonButton>
                <IonPopover
                  isOpen={isPopoverOpen}
                  event={popoverEvent}
                  onDidDismiss={handleClosePopover}
                >
                  <IonContent>
                    <IonList>
                      <IonListHeader>
                        <IonText>
                          <h6 className="text-xs">{user.email}</h6>
                        </IonText>
                      </IonListHeader>
                      <IonItem button onClick={handleLogout}>
                        <IonIcon slot="start" icon={logOutOutline} />
                        <IonText>Sign Out</IonText>
                      </IonItem>
                    </IonList>
                  </IonContent>
                </IonPopover>
              </>
            ) : (
              // If not logged in, show a signup button
              // (You could add "Sign In" too, or let them toggle inside the modal)
              <IonButton size="small" color="light" fill="clear" onClick={openSignupModal}>
                Sign Up
              </IonButton>
            )}
          </IonCol>
        </IonRow>

        {/* Routes Popover */}
        <IonPopover
          isOpen={isRoutesPopoverOpen}
          event={routesPopoverEvent}
          onDidDismiss={handleCloseRoutesPopover}
        >
          <IonContent>
            <IonList>
              <IonListHeader>
                <IonText>
                  <h5>Home</h5>
                </IonText>
              </IonListHeader>
              {/* Add route links here if needed */}
            </IonList>
          </IonContent>
        </IonPopover>

        {/* Auth Modal */}
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
      </IonToolbar>
    </IonHeader>
  );
}

export default Navbar;
