// Define all related types here
export type MaterialType =
| "glass"
| "cardboard"
| "appliances"
| "non-ferrous"
| "pallets"
| "plastic"
| "aluminum";

export interface AddressData {
  address: string;
}

export interface PickupData {
  pickupTime: string;
  addressData: AddressData;
  materials: MaterialType[];
}
