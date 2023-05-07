import { useState } from "react";
import "./App.css";
import GamePicker from "./GamePicker";
import GamePlayer from "./GamePlayer";
import { useGamepadEvents } from "./useGamepadEvents";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [initialOffset, setInitialOffset] = useState(0);
  useGamepadEvents();

  return (
    <>
      {selectedIndex === null && <GamePicker initialOffset={initialOffset} onSelected={(i) => setSelectedIndex(i)} />}
      <div style={{ display: selectedIndex === null ? "none" : "initial" }}>
        <GamePlayer
          index={selectedIndex}
          onQuit={() => {
            setInitialOffset(selectedIndex);
            setSelectedIndex(null);
          }}
        />
      </div>
    </>
  );
}

export default App;
