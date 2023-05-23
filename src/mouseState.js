let mouseMode = true;
let heldSince = null;
let held = {
  Up: false,
  Down: false,
  Left: false,
  Right: false,
};
let position = {
  x: 240,
  y: 180,
};

const movement = {
  Up: { x: 0, y: -1 },
  Down: { x: 0, y: 1 },
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
};
const directions = Object.keys(movement);
const cursor = document.getElementById("cursor");
const canvas = document.getElementById("game-canvas");

export function setMouseMode(enabled, vm) {
  mouseMode = enabled;
  heldSince = null;
  held = {
    Up: false,
    Down: false,
    Left: false,
    Right: false,
  };
  position = {
    x: 240,
    y: 180,
  };

  document.getElementById("cursor").style.display = enabled ? "initial" : "none";
  if (enabled) moveCursor(vm);
}

export function getMouseMode() {
  return mouseMode;
}

export function handleButtonDown(event, vm) {
  if (!mouseMode || event.player !== 1) return false;

  if (directions.includes(event.button)) {
    held[event.button] = true;
    return true;
  }

  if (event.button === "A") {
    vm.postIOData("mouse", {
      ...getMouseData(),
      isDown: true,
    });
    return true;
  }

  return false;
}

export function handleButtonUp(event, vm) {
  if (!mouseMode || event.player !== 1) return false;

  if (directions.includes(event.button)) {
    held[event.button] = false;
    return true;
  }

  if (event.button === "A") {
    vm.postIOData("mouse", {
      ...getMouseData(),
      isDown: false,
    });
    return true;
  }

  return false;
}

export function handleAnimationFrame(delta, time, vm) {
  if (!mouseMode) return;

  const mouseDirection = Object.entries(held)
    .filter(([_, pressed]) => pressed)
    .map(([direction]) => movement[direction])
    .reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), { x: 0, y: 0 });

  if (mouseDirection.x === 0 && mouseDirection.y === 0) {
    heldSince = null;
    return;
  }

  if (heldSince === null) {
    heldSince = time;
  }

  let t = (time - heldSince) / 2000;
  if (t > 1) t = 1;
  const velocity = easeOutQuad(t);

  if (mouseDirection.x !== 0 && mouseDirection.y !== 0) {
    mouseDirection.x *= Math.SQRT2 / 2;
    mouseDirection.y *= Math.SQRT2 / 2;
  }

  position.x = clamp(position.x + 500 * delta * velocity * mouseDirection.x, 0, 480);
  position.y = clamp(position.y + 500 * delta * velocity * mouseDirection.y, 0, 360);

  moveCursor(vm);
}

function getMouseData() {
  const x = (canvas.clientWidth * position.x) / 480;
  const y = (canvas.clientHeight * position.y) / 360;

  return {
    x,
    y,
    canvasWidth: canvas.clientWidth,
    canvasHeight: canvas.clientHeight,
  }
}

function moveCursor(vm) {
  const data = getMouseData();
  vm.postIOData("mouse", data);

  cursor.style.top = `${canvas.offsetTop + data.y}px`;
  cursor.style.left = `${canvas.offsetLeft + data.x}px`;
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
