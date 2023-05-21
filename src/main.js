import './index.css';
import './App.css';
import {
    hide,
    init as initTransition,
    reveal
} from './transition.js';
import { games } from './games.js';
import {
    init as initPicker,
    handleAnimationFrame as handleAnimationFramePicker,
    handleButtonDown as handleButtonDownPicker,
    handleButtonUp as handleButtonUpPicker,
    show as showPicker,
    hide as hidePicker
} from './gamePicker';
import {
    init as initPlayer,
    show as showPlayer,
    hide as hidePlayer,
    handleButtonDown as handleButtonDownPlayer,
    handleButtonUp as handleButtonUpPlayer,
    loadGame,
    greenFlag
} from "./gamePlayer.js";
import { handleAnimationFrame as handleAnimationFrameGamepad } from './gamepadEvents';

let previousTime;
let mode = "picking";

init();
await reveal();

function init() {
    initTransition();
    initPicker(games, handleSelectGame);
    initPlayer(handleExit);

    document.addEventListener("keydown", handleButtonDown);
    document.addEventListener("keyup", handleButtonUp);
    document.addEventListener("custombuttondown", handleButtonDown);
    document.addEventListener("custombuttonup", handleButtonUp);
    requestAnimationFrame(handleAnimationFrame);
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

function handleAnimationFrame(time) {
    handleAnimationFrameGamepad();

    if (previousTime) {
        const deltaTime = (time - previousTime) / 1000;
        if (mode !== "playing") {
            handleAnimationFramePicker(deltaTime, time);
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
