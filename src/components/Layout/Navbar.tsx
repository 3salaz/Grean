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
import { useProfile } from "../../context/ProfileContext";

function Navbar() {
  const { user, logOut } = useAuth();
  const { profile } = useProfile();

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
      <IonToolbar color="primary" className="h-full" id="navbar">
        <IonRow className="m-0 p-0 md:p-2 h-12 container mx-auto items-center justify-between ion-align-items-center">
          {/* Mobile Menu Button - Visible only on small screens */}
          <IonCol size="auto" className="lg:hidden h-full flex items-center">
            <IonButton fill="clear" className="h-full ion-align-self-center" onClick={handleOpenRoutesPopover}>
              <IonIcon slot="icon-only" color="light" icon={menuOutline}></IonIcon>
            </IonButton>
          </IonCol>

          {/* Logo Section */}
          <IonCol size="auto" className="items-center flex h-full">
            <Link to="/">
              <img
                className="h-8 w-8 rounded-full"
                src={logo}
                alt="Grean Logo"
              />
            </Link>
          </IonCol>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <IonCol className="hidden md:flex gap-6 items-center h-full">
            <Link to="/link1" className="text-white">
              Link 1
            </Link>
            <Link to="/link2" className="text-white">
              Link 2
            </Link>
            <Link to="/link3" className="text-white">
              Link 3
            </Link>
          </IonCol>

          {/* Account/Profile Section */}
          <IonCol className="flex items-center justify-end h-full">
            {user && profile ? (
              <>
                {/* If logged in, show avatar & popover */}
                <IonButton fill="clear" onClick={handleOpenPopover}>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={profile.profilePic || avatar}
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
              // If not logged in, show signup button
              <IonButton
                size="small"
                color="light"
                fill="solid"
                onClick={openSignupModal}
              >
                Sign Up
              </IonButton>
            )}
          </IonCol>
        </IonRow>

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
