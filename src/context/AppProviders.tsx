// src/context/AppProviders.tsx
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ProfileProvider } from "./ProfileContext";
import { PickupsProvider } from "./PickupsContext";
import { LocationsProvider } from "./LocationsContext";
import { TabProvider } from "./TabContext";

const AppProviders = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <ProfileProvider>
      <LocationsProvider>
        <PickupsProvider>
          <TabProvider>
            {children}
          </TabProvider>
        </PickupsProvider>
      </LocationsProvider>
    </ProfileProvider>
  </AuthProvider>
);

export default AppProviders;
