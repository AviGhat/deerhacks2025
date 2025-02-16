"use client"; // Ensures it runs only on the client-side

import { useState, useEffect} from "react";
import { GoogleMap, StreetViewPanorama, LoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";


 // ✅ Correct global import in Next.js



export default function MapComponent() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState(""); 
  const [hasStreetView, setHasStreetView] = useState(true); 
  const [mapsLoaded, setMapsLoaded] = useState(false); 
  const [history, setHistory] = useState([]); 
  const [count, setCount] = useState(0);

  async function fetchLocationHistory() {
    try {
      const res = await fetch("/api/location-history");
      if (!res.ok) throw new Error("Failed to fetch location history");

      const data = await res.json();
      if (data.length > 0) {
        setHistory(data); 
        loadLocation(data[0].location); 
      }
    } catch (error) {
      console.error("Error fetching location history:", error);
    }
  }

  async function loadLocation(city) {
    console.log("Fetching coordinates for:", city);
    setCityName(city);

    const coords = await getCoordinates(city);
    if (coords) {
      setLocation(coords);
      if (mapsLoaded) {
        checkStreetView(coords);
      }
    }
  }

  function nextInList() {
    if (history.length === 0) return;
    const newIndex = (count + 1) % history.length; 
    setCount(newIndex); 
    loadLocation(history[newIndex].location); 
  }

  function checkStreetView(coords) {
    if (!mapsLoaded) return;
    const streetViewService = new window.google.maps.StreetViewService();
    streetViewService.getPanorama({ location: coords, radius: 100 }, (data, status) => {
      if (status === "OK") {
        console.log("✅ Street View is available!");
        setHasStreetView(true);
      } else {
        console.log("❌ No Street View available, falling back to Map View.");
        setHasStreetView(false);
      }
    });
  }

  useEffect(() => {
    fetchLocationHistory();
  }, []);

  if (!location) return <p>Loading Map...</p>;

  return (
    <div>
      <div className="banner">
        <h1>Explore your personalized location recomendations</h1>
        <button onClick={() => router.push("/")} className="home-button">🏠 Return to Home</button>
      </div>
    <div className="text-center">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          console.log("✅ Google Maps API Loaded!");
          setMapsLoaded(true);
          if (location) checkStreetView(location); 
        }}
      >
        <GoogleMap mapContainerClassName="map-container" center={location} zoom={12}>
          {hasStreetView ? (
            <StreetViewPanorama position={location} visible={true} />
          ) : (
            <p className="mt-4 text-red-500 font-semibold">No Street View available for this location.</p>
          )}
        </GoogleMap>
      </LoadScript>
      <div className="info-col">
      <div className="location-info">
        <p>📍 <strong>City:</strong> {cityName}</p>
        <p>🌍 <strong>Latitude:</strong> {location.lat}</p>
        <p>🗺️ <strong>Longitude:</strong> {location.lng}</p>
      </div>
      

      <button onClick={nextInList}className="next-button">
        ⏩ Next Location
      </button>

   

      </div>
      {/* ✅ Corrected CSS Usage */}
      
    </div>
   </div>
  );
}

// 🔹 **Fetch Latitude & Longitude from Google Geocoding API**
async function getCoordinates(cityName) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK") {
      const location = data.results[0].geometry.location;

      console.log("Fetched Coordinates:", { lat: location.lat, lng: location.lng });

      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding failed:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}
