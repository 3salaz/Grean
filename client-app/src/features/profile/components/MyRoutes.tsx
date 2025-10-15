import React from "react";
import {UserProfile} from "../../context/ProfileContext";
import {IonSpinner} from "@ionic/react";

interface MyRoutesProps {
  profile: UserProfile | null;
}

const MyRoutes: React.FC<MyRoutesProps> = ({profile}) => {
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <IonSpinner />
      </div>
    );
  }
  return <div>MyRoutes</div>;
};

export default MyRoutes;
