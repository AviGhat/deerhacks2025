"use client"; // Ensures it runs only on the client-side

import { useState, useEffect} from "react";
import { GoogleMap, StreetViewPanorama, LoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";

export default function MapComponent( {locations} ) {
  const router = useRouter();
  // useState Hooks
  // manages states for locations, current city, if the city has a streetview, if maps are loaded, locations list, and current index of tha
  // location list
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState(""); 
  const [hasStreetView, setHasStreetView] = useState(true); 
  const [mapsLoaded, setMapsLoaded] = useState(false); 
  const [history, setHistory] = useState([]); 
  const [count, setCount] = useState(0);
  const [desc, setDesc] = useState("");

  // helper functions
  // grabs first location in list and loads it into streetview
  async function fetchLocationHistory(location_list) {
    try {
      const data = location_list
      if (data.length > 0) {
        // setting list of locations for future use
        setHistory(data); 
        setDesc(data[0].desc);
        loadLocation(data[0].name); 
      }
    } catch (error) {
      console.error("Error fetching location history:", error);
    }
  }

  // finding coordinates for location name, and then loading it into the map
  async function loadLocation(city) {
    console.log("Fetching coordinates for:", city);
    setCityName(city);
    // fetch coordinates
    const coords = await getCoordinates(city);
    if (coords) {
      // update location state
      setLocation(coords);
      if (mapsLoaded) {
        checkStreetView(coords);
      }
    }
  }

  // increment index of location list, loads next location
  function nextInList() {
    if (history.length === 0) return;
    const newIndex = (count + 1) % history.length; 

    // update index, desciption and load location
    setCount(newIndex);
    setDesc(history[newIndex].desc);
    loadLocation(history[newIndex].name); 
  }

  // main streetview function
  function checkStreetView(coords) {
    if (!mapsLoaded) return;
    const streetViewService = new window.google.maps.StreetViewService();
    
    streetViewService.getPanorama({ location: coords, radius: 100 }, (data, status) => {
      if (status === "OK" && data.location && data.location.pano) {
        console.log("✅ Street View is available!");
        setHasStreetView(true);
        setLocation({ lat: coords.lat, lng: coords.lng, pano: data.location.pano }); // Store pano ID
      } else {
        console.log("❌ No Street View available, falling back to Map View.");
        setHasStreetView(false);
      }
    });
  }

  // runs on initial render
  useEffect(() => {
    fetchLocationHistory(locations.locations);
  }, []);

  if (!location) return <p>Loading Map...</p>;

  return (
    <div>
      <div className="banner">
        <h1>Explore your personalized locations!</h1>
        <button onClick={() => router.push("/")} className="home-button">🏠 Return to Home</button>
      </div>
    <div className="text-center">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          console.log(desc);
          console.log("✅ Google Maps API Loaded!");
          setMapsLoaded(true);
          if (location) checkStreetView(location); 
        }}
      >
        <GoogleMap mapContainerClassName="map-container" center={location} zoom={12}>
        {hasStreetView ? (
          <StreetViewPanorama
            position={location}
            pano={location.pano} // Use pano ID
            visible={true}
          />
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
        <p>📝 <strong>Description:</strong> {desc}</p>
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