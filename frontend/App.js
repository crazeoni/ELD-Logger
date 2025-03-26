import React from "react";
import TripForm from "./TripForm";
import TripList from "./TripList";
import ELDLog from "./ELDLog";

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">ELD Log App</h1>
      <TripForm />
      <TripList />
    </div>
  );
};

export default App;
