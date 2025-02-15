"use client"; // Needed for client-side rendering



import { useState, useEffect } from "react";
import { GoogleMap, StreetViewPanorama, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const randomLocations = [
  { lat: 40.748817, lng: -73.985428 }, // NYC
  { lat: 35.6762, lng: 139.6503 }, // Tokyo
  { lat: 48.8566, lng: 2.3522 }, // Paris
];

export default function MapComponent() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const randomLocation = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    setLocation(randomLocation);
  }, []);

  if (!location) return <p>Loading Map...</p>;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={12}>
        <StreetViewPanorama position={location} visible={true} />
      </GoogleMap>
    </LoadScript>
  );
}
