// types/pickups.ts
export const materialTypes: MaterialType[] = [
  "glass",
  "cardboard",
  "appliances",
  "non-ferrous",
  "pallets",
  "plastic",
  "aluminum",
];

export type MaterialType =
  | "glass"
  | "cardboard"
  | "appliances"
  | "non-ferrous"
  | "pallets"
  | "plastic"
  | "aluminum";

export interface MaterialEntry {
  type: MaterialType;
  weight: number;
}


export interface AddressData {
  address: string;
}

export interface PickupData {
  pickupTime: string;
  addressData: AddressData;
  materials: MaterialEntry[];
  disclaimerAccepted: boolean; 

}

export interface Pickup extends Omit<PickupData, "materials"> {
  id: string;
  createdAt: string;
  status: "pending" | "accepted" | "inProgress" | "completed" | "cancelled";
  createdBy: {
    userId: string;
    displayName: string;
    email: string;
    photoURL: string;
  };
  acceptedBy?: string;
  addressData: AddressData;
  pickupDate: string;
  pickupNote?: string;
  materials: MaterialEntry[];
}

export interface MaterialConfig {
  label: string;
  requiresPhoto?: boolean;
  requiresAgreement?: boolean;
  agreementLabel?: string;
  min?: number;
  max?: number;
  description?: string;
}

export const materialConfig: Record<MaterialType, MaterialConfig> = {
  glass: {
    label: "Glass",
    requiresAgreement: true,
    agreementLabel: "I agree to the Glass Disclaimer",
    min: 1,
    max: 10,
  },
  cardboard: {
    label: "Cardboard",
    requiresPhoto: true,
    requiresAgreement: true, // ✅ now requires agreement
    agreementLabel: "I agree to the Cardboard Disclaimer",
    min: 1,
    max: 10,
  },
  appliances: {
    label: "Appliances",
    requiresPhoto: true,
  },
  "non-ferrous": {
    label: "Non-Ferrous Metals",
    requiresPhoto: true,
    requiresAgreement: true,
    agreementLabel: "I agree to the Non-Ferrous Metals Disclaimer",
  },
  pallets: {
    label: "Pallets",
    min: 4,
    max: 30,
  },
  plastic: {
    label: "Plastic",
    min: 3,
    max: 20,
  },
  aluminum: {
    label: "Aluminum",
    min: 3,
    max: 20,
  },
};

