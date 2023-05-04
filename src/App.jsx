import { useState } from "react";
import "./App.css";
import GamePicker from "./GamePicker";
import GamePlayer from "./GamePlayer";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <GamePicker onSelected={(i) => setSelectedIndex(i)} />
      <GamePlayer index={selectedIndex} />
    </>
  );
}

export default App;
