// src/context/AppProviders.tsx
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { PickupsProvider } from "@/context/PickupsContext";
import { LocationsProvider } from "@/context/LocationsContext";
import { TabProvider } from "@/context/TabContext";

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

