import React from 'react';
import './App.css';
import { useStreak } from "./lib"

const Streak = () => {
  const count = 2;
  const today = new Date()
  const streak = useStreak(localStorage, today)
  return (
    <div>
      <h3 style={{fontSize: "4rem"}}>Current Streak</h3>
      <p style={{fontSize: "2rem"}}>{count} day{count > 1 ? "s" : ""}</p>
      <p>{JSON.stringify(streak)}</p>
      <p>hi</p>
    </div>

  )
}

function App() {
  return (
    <div className="App">

    <Streak />
        
    </div>
  );
}

export default App;
