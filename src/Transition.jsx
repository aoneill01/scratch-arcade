import { gsap } from "gsap";
import { useEffect } from "react";
import { themes } from "./themes";

const size = 120;
const rows = 1080 / size;
const cols = 1920 / size;

function calculateDelay(row, col) {
  // if ((row + col) % 2 === 0) {
  return row + col;
  // }
  // return 30 + rows - 1 + cols - 1 - (row + col);
}

export default function Transition({ transition }) {
  useEffect(() => {
    if (!transition) return;
    const squares = document.querySelectorAll(".square");
    const tl = gsap.timeline({ repeat: 1, repeatDelay: 0.5, yoyo: true });
    for (const square of squares) {
      tl.fromTo(
        square,
        { scale: 0, opacity: 0.4, fill: themes.blue.stroke, rotation: 0, transformOrigin: "center" },
        { scale: 1, opacity: 1, rotation: 180, duration: 1, delay: square.dataset.delay / 20 },
        0
      );
    }
  }, [transition]);

  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{ width: "100vw", aspectRatio: "1920/1080", position: "absolute", right: 0, zIndex: 5 }}
    >
      {Array.from({ length: rows }, (_, i) => i).flatMap((row) =>
        Array.from({ length: cols }, (_, i) => i).map((col) => (
          <rect
            key={`${row}-${col}`}
            x={col * size}
            y={row * size}
            width={size + 2}
            height={size + 2}
            fill="none"
            className="square"
            data-delay={calculateDelay(row, col)}
          />
        ))
      )}
    </svg>
  );
}
