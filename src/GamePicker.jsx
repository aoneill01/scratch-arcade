import { useEffect, useRef, useState } from "react";
import BoxArt from "./BoxArt";
import { themes } from "./themes";
import { games } from "./games";
import { useAnimationFrame } from "./useAnimationFrame";

const orderedThemes = [themes.orange, themes.blue, themes.red, themes.green, themes.yellow, themes.pink];

function getPosition(i, offset) {
  const boxWidth = 150;
  const boxMargin = 10;
  const screenWidth = 640;
  const middle = (screenWidth - boxWidth) / 2;
  const wrap = games.length;

  let position = i - offset;
  if (position < 0) {
    position = wrap + (position % wrap);
  }
  position %= wrap;
  if (position > wrap / 2) {
    position -= wrap;
  }
  return middle + (boxWidth + boxMargin) * position;
}

export default function GamePicker({ onSelected }) {
  const acceleration = useRef(0);
  const velocity = useRef(0);
  const position = useRef(0);
  const selected = useRef(0);
  const handleSelected = useRef();
  const [offset, setOffset] = useState(0);

  handleSelected.current = onSelected;

  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          acceleration.current = -1;
          break;
        case "ArrowRight":
          acceleration.current = 1;
          break;
        default:
        // nothing
      }
    };
    const onKeyUp = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          if (acceleration.current === -1) acceleration.current = 0;
          selected.current = Math.floor(position.current);
          if ((selected.current - position.current) / velocity.current < 0.03) selected.current--;
          handleSelected.current(selected.current);
          break;
        case "ArrowRight":
          if (acceleration.current === 1) acceleration.current = 0;
          selected.current = Math.ceil(position.current);
          if ((selected.current - position.current) / velocity.current < 0.03) selected.current++;
          handleSelected.current(selected.current);
          break;
        default:
        // nothing
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useAnimationFrame((deltaTime) => {
    let maxVelocity = 8;
    if (acceleration.current === 0) {
      velocity.current = 2000 * deltaTime * (selected.current - position.current);
      maxVelocity = 4;
    } else {
      velocity.current += acceleration.current * deltaTime * 10;
    }
    velocity.current = Math.max(Math.min(velocity.current, maxVelocity), -maxVelocity);
    if (Math.abs(velocity.current) < 0.001) velocity.current = 0;
    position.current += velocity.current * deltaTime;
    setOffset(position.current);
  });

  return (
    <div className="App">
      <svg width="640" height="480" viewBox="0 0 640 480">
        <style>
          {`.title {
                font: bold 18px 'Gugi', sans-serif;
              }`}
        </style>

        <rect width="640" height="480" fill="#855CD6" />

        {games.map((game, i) => (
          <BoxArt
            key={game.id}
            x={getPosition(i, offset)}
            y="130"
            title={game.title}
            theme={orderedThemes[i % orderedThemes.length]}
            thumbnail={`https://uploads.scratch.mit.edu/projects/thumbnails/${game.id}.png`}
          />
        ))}

        <rect width="170" height="220" x="235" y="120" stroke="#FFAB19" strokeWidth="10" fill="none" />
      </svg>
    </div>
  );
}
