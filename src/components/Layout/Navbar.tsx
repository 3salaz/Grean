import {useState} from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.svg";
import {Link} from "react-router-dom";
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
  IonHeader,
  IonTitle,
  IonButtons,
  IonMenuButton
} from "@ionic/react";
import {logInOutline, logOutOutline, menuOutline} from "ionicons/icons";
import {useAuth} from "../../context/AuthContext";
import {useProfile} from "../../context/ProfileContext";

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
    <IonHeader className="ion-no-border ion-no-padding">
      <IonToolbar color="primary" className="h-full">
        <IonButtons className="lg:hidden" slot="start">
          <IonMenuButton
            onClick={handleOpenRoutesPopover}
            autoHide={false}
          ></IonMenuButton>
        </IonButtons>
        <IonTitle>
          <Link to="/" className="bg-blue-400">
            <img
              className="aspect-square w-8 rounded-full object-cover"
              src={logo}
              alt="Grean Logo"
            />
          </Link>
        </IonTitle>
        {/* If logged in, show avatar & popover */}
        {user ? (
          <IonButton fill="clear" slot="end" onClick={handleOpenPopover}>
            <img
              className="h-10 w-10 rounded-full text-white"
              src={profile?.profilePic || avatar}
              alt="User Avatar"
            />
          </IonButton>
        ) : (
          <IonButton
            className="pr-1 text-xs"
            slot="end"
            onClick={openSignupModal}
            fill="solid"
            color="light"
          >
            Sign Up
            <IonIcon slot="end" icon={logInOutline}></IonIcon>
          </IonButton>
        )}

        {/* Mobile Routes Popover */}
        <IonPopover
          isOpen={isRoutesPopoverOpen}
          event={routesPopoverEvent}
          onDidDismiss={handleCloseRoutesPopover}
        >
          <IonContent>
            <IonList>
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
          <IonContent fullscreen>
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
