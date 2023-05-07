import { useEffect, useRef, useState } from "react";
import BoxArt from "./BoxArt";
import { themes } from "./themes";
import { games } from "./games";
import { useAnimationFrame } from "./useAnimationFrame";
import Floater from "./Floater";

const orderedThemes = [themes.orange, themes.blue, themes.red, themes.green, themes.yellow, themes.pink];

function getPosition(i, offset, velocity) {
  const boxWidth = 300;
  const boxMargin = 20;
  const screenWidth = 1920;
  const middle = (screenWidth - boxWidth) / 2;
  const wrap = games.length * 2;

  let position = i - offset;
  if (position < 0) {
    position = wrap + (position % wrap);
  }
  position %= wrap;
  if (position > wrap / 2) {
    position -= wrap;
  }
  return middle + (boxMargin + boxWidth) * position;
}

const getScale = (i, offset, velocity) => {
  const wrap = games.length * 2;

  let position = i - offset;
  if (position < 0) {
    position = wrap + (position % wrap);
  }
  position %= wrap;
  if (position > wrap / 2) {
    position -= wrap;
  }
  const distance = Math.abs(position);
  const maxDistance = 2.1;
  if (distance > maxDistance) return 0.8;
  const factor = -(Math.cos((Math.PI * distance) / maxDistance) - 1) / 2;
  return 1 - 0.2 * factor;
};

export default function GamePicker({ onSelected, initialOffset }) {
  const acceleration = useRef(0);
  const velocity = useRef(0);
  const position = useRef(initialOffset);
  const selected = useRef(initialOffset);
  const handleSelected = useRef();
  const [offset, setOffset] = useState(initialOffset);

  handleSelected.current = onSelected;

  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          acceleration.current = -1;
          selected.current = null;
          break;
        case "ArrowRight":
          acceleration.current = 1;
          selected.current = null;
          break;
        case " ":
          if (selected.current !== null) {
            handleSelected.current(selected.current);
          }
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
          break;
        case "ArrowRight":
          if (acceleration.current === 1) acceleration.current = 0;
          selected.current = Math.ceil(position.current);
          if ((selected.current - position.current) / velocity.current < 0.03) selected.current++;
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

  const getGame = () => {
    if (selected.current === null) return null;

    let index = selected.current;
    if (index < 0) {
      index = games.length + (index % games.length);
    }
    index %= games.length;

    return games[index];
  };

  return (
    <div className="App">
      <svg viewBox="0 0 1920 1080" style={{ width: "100vw", aspectRatio: "1920/1080" }}>
        <style>
          {`.title {
                font: bold 32px 'Gugi', sans-serif;
            }`}
        </style>

        <defs>
          <linearGradient id="backgroundGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#774DCB" />
            <stop offset="100%" stopColor="#9966FF" />
          </linearGradient>
        </defs>

        <rect width="1920" height="1080" fill="url(#backgroundGradient)" />

        <Floater offset={offset + 5} distance={20} y={1000} theme={themes.orange} />
        <Floater offset={offset + 130} distance={18} y={250} theme={themes.pink} />
        <Floater offset={offset + 85} distance={14} y={750} theme={themes.red} />
        <Floater offset={offset + 80} distance={12} y={130} theme={themes.yellow} />
        <Floater offset={offset + 80} distance={10.5} y={650} theme={themes.blue} />
        <Floater offset={offset} distance={10} y={60} theme={themes.green} />

        {[...games, ...games].map((game, i) => (
          <BoxArt
            key={i}
            x={getPosition(i, offset, velocity.current)}
            y="300"
            scale={getScale(i, offset, velocity.current)}
            title={game.title}
            theme={orderedThemes[i % orderedThemes.length]}
            thumbnail={`https://uploads.scratch.mit.edu/projects/thumbnails/${game.id}.png`}
          />
        ))}
      </svg>

      <div className="game-description">{getGame()?.title}</div>
    </div>
  );
}
