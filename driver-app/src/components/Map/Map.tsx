import { APIProvider } from "@vis.gl/react-google-maps";
import { UserProfile } from "../../context/ProfileContext";
import InternalMap from "./InternalMap";

interface MapContainerProps {
  profile: UserProfile | null;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const MapContainer: React.FC<MapContainerProps> = ({ profile }) => (
  <APIProvider apiKey={API_KEY}>
    <InternalMap profile={profile} />
  </APIProvider>
);

export default MapContainer;
