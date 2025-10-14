// Fix for IonReactRouter type mismatch in TS projects using React Router v5
declare module "@ionic/react-router" {
  import * as React from "react";
  import { IonReactRouter as IonReactRouterOriginal } from "@ionic/react-router";

  export interface IonReactRouterFixedProps {
    children?: React.ReactNode;
  }

  export const IonReactRouter: React.FC<IonReactRouterFixedProps> & typeof IonReactRouterOriginal;
}