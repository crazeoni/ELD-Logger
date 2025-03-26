//import React, { useState } from "react";
//import Map, { Marker, Source, Layer } from "react-map-gl";

//const MAPBOX_TOKEN = "5b3ce3597851110001cf624830984b62eb2349049713a228ff9ba00d";

//const TripList = ({ trips }) => {
  //const [viewport, setViewport] = useState({
    //latitude: 40.7128, // Default location
    //longitude: -74.006,
    //zoom: 10,
  //});

  //return (
    //<div className="map-container">
      //<Map
        //initialViewState={viewport}
        //style={{ width: "100%", height: "400px" }}
        //mapStyle="mapbox://styles/mapbox/streets-v11"
        //mapboxAccessToken={MAPBOX_TOKEN}
      //>
        //{trips.map((trip, index) => (
          //<Marker key={index} latitude={trip.pickupLat} longitude={trip.pickupLng}>
            //<div className="marker">📍</div>
          //</Marker>
        //))}
      //</Map>
    //</div>
  //);
//};

//export default TripList;
import React, { useState } from "react";

const TripList = ({ trips }) => {
  const downloadLog = (tripId) => {
    window.open(`http://127.0.0.1:8000/trips/generate_log/${tripId}/`, "_blank");
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
