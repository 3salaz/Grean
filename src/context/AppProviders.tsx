// src/context/AppProviders.tsx
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ProfileProvider } from "./ProfileContext";
import { PickupsProvider } from "./PickupsContext";
import { LocationsProvider } from "./LocationsContext";
import { TabProvider } from "./TabContext";

// 📦 Wraps the app in all necessary context providers
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <AuthProvider>           {/* Handles Firebase Authentication */}
    <ProfileProvider>      {/* Loads and maintains user profile */}
      <LocationsProvider>  {/* Manages location-related state */}
        <PickupsProvider>  {/* Handles pickups state and logic */}
          <TabProvider>     {/* Manages UI state like active tabs */}
            {children}
          </TabProvider>
        </PickupsProvider>
      </LocationsProvider>
    </ProfileProvider>
  </AuthProvider>
);

