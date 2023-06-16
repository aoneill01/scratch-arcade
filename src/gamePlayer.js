import "../lib/player";
import { GamepadHandler } from "./gamepadHandler";
import { reset, updateMonitors } from "./monitors";

const DEFAULT_CONTROLS = "!UDLRSzx___!^V<>*_____";

let vm;
let onQuit;
let gamepadHandler;

export function init(quit) {
  onQuit = quit;
  const canvas = document.getElementById("game-canvas");

  vm = new window.player.VirtualMachine();
  const renderer = new window.player.ScratchRender(canvas);
  canvas.height = (1080 / 1920) * document.body.clientWidth;
  canvas.width = (canvas.height * 480) / 360;
  const audioEngine = new window.player.AudioEngine();
  const storage = new window.player.ScratchStorage();
  const AssetType = storage.AssetType;
  const ScratchSVGRenderer = window.player.ScratchSVGRenderer;

  storage.addWebStore(
    [AssetType.Project, AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound],
    (asset) => `/games/${asset.assetId}.${asset.dataFormat}`
  );
  vm.attachStorage(storage);

  vm.attachRenderer(renderer);
  vm.attachAudioEngine(audioEngine);
  vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());
  vm.setCompatibilityMode(true);
  vm.addListener("MONITORS_UPDATE", (monitors) => updateMonitors(monitors, vm));
}

export async function loadGame(game) {
  gamepadHandler = new GamepadHandler(vm, game.controls ?? DEFAULT_CONTROLS, onQuit);

  vm.stopAll();
  reset();
  const response = await fetch(game.sb3);
  const buffer = await response.arrayBuffer();
  await vm.loadProject(buffer);
  vm.start();
}

export function greenFlag() {
  vm.greenFlag();
}

export function show() {
  document.getElementById("game-player").style.display = "initial";
}

export function hide() {
  document.getElementById("game-player").style.display = "none";
}

export function handleButtonDown(event) {
  gamepadHandler.handleButtonDown(event);
}

export function handleButtonUp(event) {
  gamepadHandler.handleButtonUp(event);
}

export function handleAnimationFrame(delta, time) {
  gamepadHandler.handleAnimationFrame(delta, time);
}

export function handleMouseMove(event) {
  gamepadHandler.handleMouseMove(event);
}