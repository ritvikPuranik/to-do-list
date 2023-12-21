import { EthProvider } from "./contexts/EthContext";
// import { useState } from "react";


import TaskList from "./components/TaskList";
import UserDetails from "./components/UserDetails";

function App() {
  
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <TaskList />
          <UserDetails />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
