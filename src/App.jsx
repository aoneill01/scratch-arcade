import { useState } from "react";
import "./App.css";
import GamePicker from "./GamePicker";
import GamePlayer from "./GamePlayer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GamePicker />
      <GamePlayer />
    </>
  );
}

export default App;
