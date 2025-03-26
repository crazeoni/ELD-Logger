import React, { useState } from "react";
import axios from "axios";

const TripForm = ({ fetchTrips }) => {
  const [trip, setTrip] = useState({ current_location: "", pickup_location: "", dropoff_location: "", current_cycle_hours: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/api/trips/", trip);
    fetchTrips();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <input type="text" placeholder="Current Location" className="block p-2 border" onChange={(e) => setTrip({ ...trip, current_location: e.target.value })} required />
      <input type="text" placeholder="Pickup Location" className="block p-2 border mt-2" onChange={(e) => setTrip({ ...trip, pickup_location: e.target.value })} required />
      <input type="text" placeholder="Dropoff Location" className="block p-2 border mt-2" onChange={(e) => setTrip({ ...trip, dropoff_location: e.target.value })} required />
      <input type="number" placeholder="Current Cycle Hours" className="block p-2 border mt-2" onChange={(e) => setTrip({ ...trip, current_cycle_hours: e.target.value })} required />
      <button type="submit" className="p-2 bg-blue-500 text-white mt-2">Submit</button>
    </form>
  );
};

export default TripForm;
