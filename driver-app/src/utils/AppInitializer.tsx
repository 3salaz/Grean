import { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const AppInitializer = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "beta",
      libraries: ["places"]
    });

    loader.load().then(() => {
      console.log("Google Maps API loaded");
    }).catch(e => {
      console.error("Error loading Google Maps API:", e);
    });
  }, []);

  return null;
};

export default AppInitializer;
