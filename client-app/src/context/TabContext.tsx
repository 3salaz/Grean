// src/context/TabContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { TabOption } from "../types/tabs";

interface TabContextProps {
  activeTab: TabOption;
  setActiveTab: React.Dispatch<React.SetStateAction<TabOption>>;
}

const TabContext = createContext<TabContextProps | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabOption>("pickups");
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error("useTab must be used within a TabProvider");
  return context;
};
