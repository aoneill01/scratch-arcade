import { useRef } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

function wrapAround(value, min, max) {
  const range = max - min;
  let fromMin = value - min;

  if (fromMin < 0) {
    fromMin = range + (fromMin % range);
  }
  fromMin %= range;
  return fromMin + min;
}

export default function Floater({ offset, distance, y, theme }) {
  const ref = useRef();
  const refOffset = useRef(offset);
  const refDistance = useRef(distance);
  const refY = useRef(y);
  refOffset.current = offset;
  refDistance.current = distance;
  refY.current = y;

  useAnimationFrame((_, time) => {
    if (ref.current) {
      const factor = 1 / refDistance.current;
      ref.current.setAttribute(
        "transform",
        `translate(0, ${y})
        translate(${wrapAround((960 - 500 * refOffset.current) * factor, -300, 2000)}, 0)
        scale(${20 * factor})
        translate(0, ${14 * Math.sin(refDistance.current + time / 1000)})
        rotate(${11 * Math.sin(refDistance.current + time / 3100)})`
      );
    }
  });
  return (
    <g ref={ref}>
      <path
        stroke={theme.stroke}
        fill={theme.fill}
        d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 145.39197158813477 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"
        style={{ transformOrigin: "150px 50px" }}
      ></path>
    </g>
  );
}
