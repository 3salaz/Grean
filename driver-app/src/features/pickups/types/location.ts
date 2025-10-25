// features/pickups/types/location.ts

export type UserLocation = {
  id: string;
  address: string;
  // You can expand this as needed:
  city?: string;
  zipCode?: string;
  instructions?: string;
  [key: string]: any; // temporary fallback for additional props
};
