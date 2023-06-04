const movement = {
  Up: { x: 0, y: -1 },
  Down: { x: 0, y: 1 },
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
};
const cursor = document.getElementById("cursor");
const canvas = document.getElementById("game-canvas");

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function parseMapping(mapping) {
  switch (mapping) {
    case "U":
      return {
        type: "key",
        data: "ArrowUp",
      };
    case "D":
      return {
        type: "key",
        data: "ArrowDown",
      };
    case "L":
      return {
        type: "key",
        data: "ArrowLeft",
      };
    case "R":
      return {
        type: "key",
        data: "ArrowRight",
      };
    case "S":
      return {
        type: "key",
        data: " ",
      };
    case "_":
      return {
        type: "ignored",
      };
    case "^":
      return {
        type: "mouse",
        data: "Up",
      };
    case "V":
      return {
        type: "mouse",
        data: "Down",
      };
    case "<":
      return {
        type: "mouse",
        data: "Left",
      };
    case ">":
      return {
        type: "mouse",
        data: "Right",
      };
    case "*":
      return {
        type: "mouse",
        data: "Click",
      };
    case "Start":
    case "Stop":
      return {
        type: "control",
        data: mapping,
      };
    default:
      return {
        type: "key",
        data: mapping,
      };
  }
}

class MouseState {
  heldSince = null;
  lastAction = null;
  markAction = false;
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

  getMouseData() {
    const x = (canvas.clientWidth * this.position.x) / 480;
    const y = (canvas.clientHeight * this.position.y) / 360;

    return {
      x,
      y,
      canvasWidth: canvas.clientWidth,
      canvasHeight: canvas.clientHeight,
    };
  }
}

export class GamepadHandler {
  #actions;
  #mouseState;
  #onQuit;
  #vm;

  constructor(vm, mapping, quit) {
    this.#vm = vm;
    this.#actions = {
      1: {
        Up: parseMapping(mapping.charAt(1)),
        Down: parseMapping(mapping.charAt(2)),
        Left: parseMapping(mapping.charAt(3)),
        Right: parseMapping(mapping.charAt(4)),
        A: parseMapping(mapping.charAt(5)),
        B: parseMapping(mapping.charAt(6)),
        C: parseMapping(mapping.charAt(7)),
        X: parseMapping(mapping.charAt(8)),
        Y: parseMapping(mapping.charAt(9)),
        Z: parseMapping(mapping.charAt(10)),
        Start: parseMapping("Start"),
        Stop: parseMapping("Stop"),
      },
      2: {
        Up: parseMapping(mapping.charAt(12)),
        Down: parseMapping(mapping.charAt(13)),
        Left: parseMapping(mapping.charAt(14)),
        Right: parseMapping(mapping.charAt(15)),
        A: parseMapping(mapping.charAt(16)),
        B: parseMapping(mapping.charAt(17)),
        C: parseMapping(mapping.charAt(18)),
        X: parseMapping(mapping.charAt(19)),
        Y: parseMapping(mapping.charAt(20)),
        Z: parseMapping(mapping.charAt(21)),
        Start: parseMapping("Start"),
        Stop: parseMapping("Stop"),
      },
    };
    this.#onQuit = quit;
    this.#mouseState = new MouseState();

    cursor.classList.add("hidden");
    this.#moveCursor();
  }

  handleButtonDown(event) {
    const action = this.#actions[event.player][event.button];
    switch (action.type) {
      case "key":
        this.#vm.postIOData("keyboard", {
          key: action.data,
          isDown: true,
        });
        break;
      case "mouse":
        if (action.data === "Click") {
          this.#vm.postIOData("mouse", {
            ...this.#mouseState.getMouseData(),
            isDown: true,
          });
          this.#mouseState.markAction = true;
        } else {
          this.#mouseState.held[action.data] = true;
        }
        break;
    }
  }

  handleButtonUp(event) {
    const action = this.#actions[event.player][event.button];
    switch (action.type) {
      case "key":
        this.#vm.postIOData("keyboard", {
          key: action.data,
          isDown: false,
        });
        break;
      case "mouse":
        if (action.data === "Click") {
          this.#vm.postIOData("mouse", {
            ...this.#mouseState.getMouseData(),
            isDown: false,
          });
          this.#mouseState.markAction = true;
        } else {
          this.#mouseState.held[action.data] = false;
        }
        break;
      case "control":
        if (action.data === "Start") {
          this.#vm.greenFlag();
        }
        if (action.data === "Stop") {
          this.#vm.stopAll();
          this.#onQuit();
        }
        break;
    }
  }

  handleAnimationFrame(delta, time) {
    if (this.#mouseState.markAction) {
      this.#mouseState.markAction = false;
      this.#mouseState.lastAction = time;
      cursor.classList.remove("hidden");
    }

    if (time - (this.#mouseState.lastAction ?? 0) > 1_000) {
      cursor.classList.add("hidden");
    }

    const mouseDirection = Object.entries(this.#mouseState.held)
      .filter(([_, pressed]) => pressed)
      .map(([direction]) => movement[direction])
      .reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), { x: 0, y: 0 });

    if (mouseDirection.x === 0 && mouseDirection.y === 0) {
      this.#mouseState.heldSince = null;
      return;
    }

    if (this.#mouseState.heldSince === null) {
      this.#mouseState.heldSince = time;
    }

    let t = (time - this.#mouseState.heldSince) / 2_000;
    if (t > 1) t = 1;
    const velocity = easeOutQuad(t);

    if (mouseDirection.x !== 0 && mouseDirection.y !== 0) {
      mouseDirection.x *= Math.SQRT2 / 2;
      mouseDirection.y *= Math.SQRT2 / 2;
    }

    this.#mouseState.position.x = clamp(
      this.#mouseState.position.x + 500 * delta * velocity * mouseDirection.x,
      0,
      480
    );
    this.#mouseState.position.y = clamp(
      this.#mouseState.position.y + 500 * delta * velocity * mouseDirection.y,
      0,
      360
    );

    this.#mouseState.lastAction = time;
    cursor.classList.remove("hidden");
    this.#moveCursor();
  }

  #moveCursor() {
    const data = this.#mouseState.getMouseData();
    this.#vm.postIOData("mouse", data);

    cursor.style.top = `${canvas.offsetTop + data.y}px`;
    cursor.style.left = `${canvas.offsetLeft + data.x}px`;
  }
}
