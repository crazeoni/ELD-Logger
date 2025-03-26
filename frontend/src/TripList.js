import React, { useState } from "react";
import axios from "axios";
import TripMap from "./TripMap"; // Import Map Component
import "./TripList.css"; // ✅ Import CSS file for styling

const TripList = ({ trips, onSelectTrip, fetchTrips }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  // ✅ Delete a trip from the backend
  const deleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/trips/${tripId}/`);
      alert("🚀 Trip deleted successfully!");
      fetchTrips(); // Refresh the trip list after deletion
    } catch (error) {
      console.error("❌ Error deleting trip:", error);
      alert("⚠️ Failed to delete trip. Please try again.");
    }
  };

  return (
    <div className="trip-list-container">
      {trips.map((trip) => (
        <div key={trip.id} className="trip-card">
          <div className="trip-header">
            <h3>
              {trip.pickup_location} → {trip.dropoff_location}
            </h3>
            <span className="trip-time">🕒 {trip.current_cycle_hours} hours</span>
          </div>

          <div className="trip-actions">
            {/* ✅ View Log Sheet */}
            <button className="btn btn-blue" onClick={() => onSelectTrip(trip.id)}>
              📜 View Log Sheet
            </button>

            {/* ✅ View Map */}
            <button className="btn btn-green" onClick={() => setSelectedTrip(trip)}>
              🗺️ View Map
            </button>

            {/* ✅ DELETE Trip Button */}
            <button className="btn btn-red" onClick={() => deleteTrip(trip.id)}>
              🗑️ Delete Trip
            </button>
          </div>

          {/* ✅ Show Map when selected */}
          {selectedTrip === trip && (
            <div className="trip-map-container">
              <TripMap pickup={trip.pickup_location} dropoff={trip.dropoff_location} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TripList;

