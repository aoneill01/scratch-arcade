import { useState } from "react";
import "./App.css";
import GamePicker from "./GamePicker";
import GamePlayer from "./GamePlayer";
import { useGamepadEvents } from "./useGamepadEvents";
import Transition from "./Transition";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [initialOffset, setInitialOffset] = useState(0);
  const [transition, setTransition] = useState(false);
  useGamepadEvents();

  const gameSelected = (i) => {
    setTransition(true);
    setTimeout(() => setTransition(false), 1000);
    setTimeout(() => setSelectedIndex(i), 2000);
  };

  const returnToMenu = () => {
    setTransition(true);
    setTimeout(() => setTransition(false), 1000);
    setTimeout(() => setSelectedIndex(null), 2000);
  };

  return (
    <>
      <Transition transition={transition} />
      {selectedIndex === null && <GamePicker initialOffset={initialOffset} onSelected={gameSelected} />}
      <div style={{ display: selectedIndex === null ? "none" : "initial" }}>
        <GamePlayer index={selectedIndex} onQuit={returnToMenu} />
      </div>
    </>
  );
}

export default App;
