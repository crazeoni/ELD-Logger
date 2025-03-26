import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import axios from "axios";

const TripMap = ({ pickup, dropoff }) => {
  const [route, setRoute] = useState([]);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.get(
          `https://eld-logger.onrender.com/api/get_route/?pickup=${pickup}&dropoff=${dropoff}`
        );

        console.log("🔍 API Response:", res.data); // ✅ Log API response

        if (res.data && Array.isArray(res.data.route) && res.data.route.length > 0) {
          console.log("✅ Route Data:", res.data.route);
          setRoute(res.data.route);
        } else {
          console.warn("⚠️ No route data found in API response");
          setRoute([]);
        }

        if (res.data && res.data.stops) {
          setStops(res.data.stops);
        } else {
          setStops([]);
        }
      } catch (error) {
        console.error("❌ Error fetching route:", error);
        setRoute([]);
        setStops([]);
      }
    };

    fetchRoute();
  }, [pickup, dropoff]);

  return (
    <div className="map-container">
      <MapContainer center={[37.7749, -122.4194]} zoom={7} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ✅ Draw Route */}
        {Array.isArray(route) && route.length > 0 ? (
          <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" />
        ) : (
          <p>No route data available</p>
        )}

        {/* ✅ Show Stops */}
        {stops.map((stop, index) => (
          <Marker key={index} position={[stop.lat, stop.lng]}>
            <Popup>{stop.type}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TripMap;

