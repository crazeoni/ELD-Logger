import React, { useState } from "react";
import axios from "axios";
import "./TripForm.css"; // ✅ Import CSS file for styling

const TripForm = ({ fetchTrips }) => {
  const [trip, setTrip] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_hours: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/trips/", trip);
      fetchTrips();
      alert("🚀 Trip added successfully!");
      setTrip({ current_location: "", pickup_location: "", dropoff_location: "", current_cycle_hours: "" });
    } catch (error) {
      console.error("❌ Error adding trip:", error);
      alert("⚠️ Failed to add trip. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h2 className="form-title">Add a New Trip</h2>

      <input
        type="text"
        placeholder="Current Location"
        value={trip.current_location}
        onChange={(e) => setTrip({ ...trip, current_location: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Pickup Location"
        value={trip.pickup_location}
        onChange={(e) => setTrip({ ...trip, pickup_location: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Dropoff Location"
        value={trip.dropoff_location}
        onChange={(e) => setTrip({ ...trip, dropoff_location: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Current Cycle Hours"
        value={trip.current_cycle_hours}
        onChange={(e) => setTrip({ ...trip, current_cycle_hours: e.target.value })}
        required
      />

      <button type="submit" className="btn-submit">Submit Trip</button>
    </form>
  );
};

export default TripForm;
