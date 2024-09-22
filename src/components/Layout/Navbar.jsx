import { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.svg";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";
import { useAuthProfile } from "../../context/AuthProfileContext";
import Signup from "../../components/Common/Signup";
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
import {
  logOutOutline,
  menuOutline,
} from "ionicons/icons";

function Navbar() {
  const { user, logOut } = useAuthProfile();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoutesPopoverOpen, setIsRoutesPopoverOpen] = useState(false);
  const [routesPopoverEvent, setRoutesPopoverEvent] = useState(null);

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("You are logged out");
      setIsPopoverOpen(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleOpenPopover = (event) => {
    event.persist();
    setPopoverEvent(event);
    setIsPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenRoutesPopover = (event) => {
    event.persist();
    setRoutesPopoverEvent(event);
    setIsRoutesPopoverOpen(true);
  };

  const handleCloseRoutesPopover = () => {
    setIsRoutesPopoverOpen(false);
  };

  return (
    <IonHeader className="ion-no-border ion-no-padding">
      <IonToolbar color="primary" className="h-full" id="navbar">

        <IonRow className="ion-justify-content-between ion-no-padding m-0 p-0">
          {/* Menu */}
          <IonCol color="light" className="ion-align-self-center mx-auto">
            <IonButton fill="clear" onClick={handleOpenRoutesPopover}>
              <IonIcon color="light" size="large" icon={menuOutline}></IonIcon>
            </IonButton>
          </IonCol>
          
          {/* Logo Section */}
          <IonCol className="ion-align-self-center flex items-center justify-center">

              <Link to="/">
                <img
                  className="h-10 w-10 rounded-full"
                  src={logo}
                  alt="Grean Logo"
                />
              </Link>
          </IonCol>

          {/* Navigation Links
          <IonCol size="auto" className="hidden">
            <div className="flex space-x-4">
              <Link to="/" className="text-white px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link
                to="/about"
                className="text-white px-3 py-2 text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/services"
                className="text-white px-3 py-2 text-sm font-medium"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="text-white px-3 py-2 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </IonCol> */}

          {/* Account and Profile Section */}
          <IonCol className="ion-align-self-center flex items-center justify-end">
            {user ? (
              <>
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
              <IonButton
                size="medium"
                color="light"
                fill="clear"
                onClick={handleOpenModal}
              >
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
              {/* <IonItem button routerLink="/route1">
              <IonText>Route 1</IonText>
            </IonItem>
            <IonItem button routerLink="/route2">
              <IonText>Route 2</IonText>
            </IonItem>
            <IonItem button routerLink="/route3">
              <IonText>Route 3</IonText>
            </IonItem>
            <IonItem button routerLink="/route4">
              <IonText>Route 4</IonText>
            </IonItem> */}
            </IonList>
          </IonContent>
        </IonPopover>
        
        {/* Signup Modal */}
        <IonModal isOpen={isModalOpen} onDidDismiss={handleCloseModal}>
          <Signup handleClose={handleCloseModal} />
        </IonModal>

      </IonToolbar>
    </IonHeader>
  );
}

export default Navbar;
