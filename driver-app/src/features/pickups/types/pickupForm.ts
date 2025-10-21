// types/pickupForm.ts
import { MaterialEntry } from "./pickups";
import { UserLocation } from "./location";

export type PickupFormData = {
  pickupTime: string;
  addressData: { address: string };
  materials: MaterialEntry[];
  disclaimerAccepted: boolean;
};
