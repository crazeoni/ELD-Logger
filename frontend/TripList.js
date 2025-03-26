import React, { useState } from "react";

const TripList = ({ trips }) => {
  const downloadLog = (tripId) => {
    window.open(`https://eld-logger.onrender.com/trips/generate_log/${tripId}/`, "_blank");
  };

  return (
    <div className="trip-list">
      {trips.map((trip, index) => (
        <div key={index} className="trip-card">
          <p>Trip from {trip.pickup_location} to {trip.dropoff_location}</p>
          <button 
            onClick={() => downloadLog(trip.id)} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download Log PDF
          </button>
        </div>
      ))}
    </div>
  );
};

export default TripList;
