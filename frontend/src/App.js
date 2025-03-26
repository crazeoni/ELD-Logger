//import logo from './logo.svg';
//import './App.css';

import React, { useState, useEffect, useCallback } from "react"; // Ensure useState is imported  
import axios from "axios";  
import TripForm from "./TripForm";  
import TripList from "./TripList";  
import LogSheetCanvas from "./components/LogSheetCanvas";  
import "./App.css";  

const App = () => {  
  const [trips, setTrips] = useState([]);  
  const [selectedTrip, setSelectedTrip] = useState(null);  
  const [logData, setLogData] = useState([]);  

  // Define additional state  
  const [fuelStops, setFuelStops] = useState(0);  
  const [restStops, setRestStops] = useState(0);  
  const [tripDistance, setTripDistance] = useState(0);  
  const [totalDriveHours, setTotalDriveHours] = useState(0);
  
  const API_BASE_URL = "https://eld-logger.onrender.com/api";  

  // Fetch trips  
  const fetchTrips = async () => {  
    try {  
      const response = await axios.get(`${API_BASE_URL}/trips/`);  
      setTrips(response.data);  
    } catch (error) {  
      console.error("Error fetching trips:", error);  
    }  
  };  

  const fetchTripLogs = useCallback(async (tripId) => {  
    if (!tripId) return;  

    try {  
      const response = await axios.get(`${API_BASE_URL}/trip-logs/${tripId}/`);  
      const { trip_logs, fuel_stops, rest_stops, trip_distance, total_drive_hours } = response.data;  

      setLogData(trip_logs);  
      setFuelStops(fuel_stops);  
      setRestStops(rest_stops);  
      setTripDistance(trip_distance);  
      setTotalDriveHours(total_drive_hours);  
    } catch (error) {  
      console.error("Error fetching trip logs:", error);  
    }  
  }, []);  

  useEffect(() => {  
    fetchTrips();  
  }, []);  

  useEffect(() => {  
    if (selectedTrip) {  
      fetchTripLogs(selectedTrip);  
    }  
  }, [selectedTrip, fetchTripLogs]);  

  return (  
    <div className="app-container">  
      <h1 className="app-title">ELD Log App</h1>  

      <TripForm fetchTrips={fetchTrips} />  
      <TripList trips={trips} onSelectTrip={setSelectedTrip} fetchTrips={fetchTrips} />  

      {selectedTrip && (  
        <div className="log-sheet-container">  
          <h2 className="log-title">Driver Log Sheet</h2>  
          <LogSheetCanvas   
            logData={logData}   
            fuelStops={fuelStops}   
            restStops={restStops}   
            tripDistance={tripDistance}   
            totalDriveHours={totalDriveHours}   
          />  
        </div>  
      )}  
    </div>  
  );  
};  

export default App;  
