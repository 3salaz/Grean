import {useState} from "react";
import logo from "@/assets/logo.png";
import {Link} from "react-router-dom";
import Signup from "@/features/auth/components/Signup";
import Signin from "@/features/auth/components/Signin"; 
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
  IonHeader,
  IonButtons,
  IonMenuButton
} from "@ionic/react";
import {
  logInOutline,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logOutOutline,
  personCircleOutline
} from "ionicons/icons";
import {useAuth} from "@/context/AuthContext";
import {useProfile} from "@/context/ProfileContext";

function Navbar() {
  const {user, logOut} = useAuth();
  const {profile} = useProfile();

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
    setTimeout(() => setIsAuthModalOpen(false), 100); // Small delay prevents layout shift
  };

  return (
    <IonHeader id="navbar" className="ion-no-border py-0 md:px-10">
      <IonToolbar color="secondary"  className="h-full mx-auto rounded-b-xl">
        <IonButtons className="lg:hidden" slot="start">
          <IonMenuButton
            onClick={handleOpenRoutesPopover}
            autoHide={false}
          ></IonMenuButton>
        </IonButtons>
        <div className="flex items-center justify-center w-full">
          <img
            className="h-10 rounded-full"
            src={logo}
            alt="Grean Logo"
          />
        </div>

        <IonButtons slot="end">
        {/* If logged in, show user icon & popover */}
        {user ? (
          <IonButton shape="round" onClick={handleOpenPopover}>
            <IonIcon slot="icon-only" icon={personCircleOutline} />
          </IonButton>
        ) : (
          <IonButton
            onClick={openSignupModal}
            shape="round"
            color="light"
            expand="block"
          >
            {/* Sign Up */}
            <IonIcon slot="icon-only" icon={logInOutline}></IonIcon>
          </IonButton>
        )}
        </IonButtons>

        {/* Mobile Routes Popover */}
        <IonPopover
          isOpen={isRoutesPopoverOpen}
          event={routesPopoverEvent}
          onDidDismiss={handleCloseRoutesPopover}
        >
          <IonContent>
            <IonList class="ion-padding">
              <IonListHeader>
                <IonText>
                  <h5>Grean</h5>
                </IonText>
              </IonListHeader>
              <IonItem button>
                <Link to="/">Home</Link>
              </IonItem>
              <IonItem button>
                <Link to="/account">Account</Link>
              </IonItem>
              <IonItem button>
                <Link to="/services">Services</Link>
              </IonItem>
            </IonList>
            <div className="flex items-center justify-center ion-padding">
              <IonButtons>
                <IonButton>
                  <IonIcon
                    color="primary"
                    slot="icon-only"
                    icon={logoInstagram}
                  />
                </IonButton>
                <IonButton>
                  <IonIcon
                    color="primary"
                    slot="icon-only"
                    icon={logoFacebook}
                  />
                </IonButton>
                <IonButton>
                  <IonIcon
                    color="primary"
                    slot="icon-only"
                    icon={logoLinkedin}
                  />
                </IonButton>
              </IonButtons>
            </div>
          </IonContent>
        </IonPopover>

        {/* Profile Popover */}
        {user && (
          <IonPopover
            isOpen={isPopoverOpen}
            event={popoverEvent}
            onDidDismiss={handleClosePopover}
          >
            <IonContent>
              <IonList>
                {/* Profile Email Header */}
                <IonListHeader className="bg-slate-200 flex justify-end px-3 py-2">
                  <IonText className="text-xs text-gray-600">
                    {user.email}
                  </IonText>
                </IonListHeader>

                {/* Sign Out Button */}
                <IonItem button onClick={handleLogout}>
                  <IonIcon slot="start" icon={logOutOutline} />
                  <IonText>Sign Out</IonText>
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
        )}

        {/* Auth Modal */}
        <IonModal
          isOpen={isAuthModalOpen}
          onDidDismiss={closeAuthModal}
          backdropDismiss={true}
        >
          <IonContent>
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
          </IonContent>
        </IonModal>
      </IonToolbar>
    </IonHeader>
  );
}

export default Navbar;
