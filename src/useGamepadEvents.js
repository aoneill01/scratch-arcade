import { useRef } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

const buttonMap = {
  [0]: "A",
  [8]: "Stop",
  [9]: "Start",
  [12]: "Up",
  [13]: "Down",
  [14]: "Left",
  [15]: "Right",
};

const keyMap = {
  A: [" ", "?"],
  Stop: ["Escape", "?"],
  Start: ["?", "?"],
  Up: ["ArrowUp", "w"],
  Down: ["ArrowDown", "s"],
  Left: ["ArrowLeft", "a"],
  Right: ["ArrowRight", "d"],
};

export const useGamepadEvents = () => {
  const player1 = useRef();
  const player2 = useRef();

  const processPlayer = (playerRef, gamepad, playerNumber) => {
    if (!gamepad) return;

    if (!playerRef.current) {
      playerRef.current = gamepad.buttons.map(({ pressed }) => pressed);
      return;
    }

    for (const i of Object.keys(buttonMap)) {
      if (gamepad.buttons[i].pressed !== playerRef.current[i]) {
        const eventType = gamepad.buttons[i].pressed ? "custombuttondown" : "custombuttonup";
        const event = new Event(eventType, {
          bubbles: true,
          cancelable: true,
        });
        event.button = buttonMap[i];
        event.player = playerNumber;
        event.key = keyMap[event.button][event.player - 1];
        document.dispatchEvent(event);
        playerRef.current[i] = gamepad.buttons[i].pressed;
      }
    }
  };

  useAnimationFrame(() => {
    const gamepads = navigator.getGamepads();

    processPlayer(player1, gamepads?.[0], 1);
    processPlayer(player2, gamepads?.[1], 2);
  });
};
