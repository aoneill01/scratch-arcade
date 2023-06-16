import "./main.css";
import { hide, init as initTransition, reveal } from "./transition.js";
import { loadGames } from "./games.js";
import {
  init as initPicker,
  handleAnimationFrame as handleAnimationFramePicker,
  handleButtonDown as handleButtonDownPicker,
  handleButtonUp as handleButtonUpPicker,
  show as showPicker,
  hide as hidePicker,
} from "./gamePicker";
import {
  init as initPlayer,
  show as showPlayer,
  hide as hidePlayer,
  handleAnimationFrame as handleAnimationFramePlayer,
  handleButtonDown as handleButtonDownPlayer,
  handleButtonUp as handleButtonUpPlayer,
  handleMouseMove as handleMouseMovePlayer,
  loadGame,
  greenFlag,
} from "./gamePlayer.js";
import { handleAnimationFrame as handleAnimationFrameGamepad } from "./gamepadEvents";

let previousTime;
let mode = "picking";


init();

async function init() {
  const games = await loadGames();
  
  initTransition();
  initPicker(games, handleSelectGame);
  initPlayer(handleExit);

  document.addEventListener("custombuttondown", handleButtonDown);
  document.addEventListener("custombuttonup", handleButtonUp);
  document.addEventListener("mousedown", () => {
    const event = new Event("custombuttondown", {
        bubbles: true,
        cancelable: true,
    });
    event.button = "Click";
    event.player = 1;
    document.dispatchEvent(event);
  });
  document.addEventListener("mouseup", () => {
    const event = new Event("custombuttonup", {
        bubbles: true,
        cancelable: true,
    });
    event.button = "Click";
    event.player = 1;
    document.dispatchEvent(event);
  });
  
  const body = document.querySelector("body");
  const tmpClickHandler = async () => {
    try {
      await body.requestPointerLock();
      body.removeEventListener("click", tmpClickHandler);
      document.addEventListener("mousemove", handleMouseMove);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };
  body.addEventListener("click", tmpClickHandler);

  requestAnimationFrame(handleAnimationFrame);
  
  await reveal();
}

function handleButtonDown(event) {
  switch (mode) {
    case "picking":
      handleButtonDownPicker(event);
      break;
    case "playing":
      handleButtonDownPlayer(event);
      break;
  }
}

function handleButtonUp(event) {
  switch (mode) {
    case "picking":
      handleButtonUpPicker(event);
      break;
    case "playing":
      handleButtonUpPlayer(event);
      break;
  }
}

function handleMouseMove(event) {
  switch (mode) {
    case "playing":
      handleMouseMovePlayer(event);
      break; 
  }
}

function handleAnimationFrame(time) {
  handleAnimationFrameGamepad();

  if (previousTime) {
    const deltaTime = (time - previousTime) / 1000;
    switch (mode) {
      case "playing":
        handleAnimationFramePlayer(deltaTime, time);
        break;
      default:
        handleAnimationFramePicker(deltaTime, time, mode);
        break;
    }
  }
  previousTime = time;
  requestAnimationFrame(handleAnimationFrame);
}

async function handleSelectGame(game) {
  mode = "transitioning";
  await hide();
  hidePicker();
  showPlayer();
  await loadGame(game);
  await reveal();
  greenFlag();
  mode = "playing";
}

async function handleExit() {
  mode = "transitioning";
  await hide();
  hidePlayer();
  showPicker();
  await reveal();
  mode = "picking";
}
