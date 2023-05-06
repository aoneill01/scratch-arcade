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

export default function Floater({ offset }) {
  const ref = useRef();
  const refOffset = useRef(offset);
  refOffset.current = offset;

  useAnimationFrame((_, time) => {
    if (ref.current) {
      ref.current.setAttribute(
        "transform",
        `translate(${wrapAround(960 - 50 * offset, -400, 1970)}, ${50 + 50 * Math.sin(time / 1000)})
        scale(2)
        rotate(15)`
      );
    }
  });
  return (
    <g ref={ref}>
      <path
        stroke="#3373CC"
        fill="#4C97FF"
        d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 145.39197158813477 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"
      ></path>
    </g>
  );
}
