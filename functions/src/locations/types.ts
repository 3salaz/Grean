export interface CreateLocationData {
  locationType: string;
  address: string;
  latitude?: number;
  longitude?: number;
  homeName?: string;
  businessName?: string;
  businessPhoneNumber?: string;
  category?: string;
  [key: string]: unknown; // safer than `any`
}

export interface UpdateLocationData {
  locationId: string;
  updates: Partial<CreateLocationData>;
}

export interface DeleteLocationData {
  locationId: string;
}
