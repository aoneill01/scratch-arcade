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

let player1 = {};
let player2 = {};

export function handleAnimationFrame() {
    const gamepads = navigator.getGamepads();
    processPlayer(player1, gamepads?.[0], 1);
    processPlayer(player2, gamepads?.[1], 2);
}

function processPlayer(player, gamepad, playerNumber) {
    if (!gamepad) return;

    if (!player.buttons) {
        player.buttons = gamepad.buttons.map(({ pressed }) => pressed);
        return;
    }

    for (const i of Object.keys(buttonMap)) {
        if (gamepad.buttons[i].pressed !== player.buttons[i]) {
            const eventType = gamepad.buttons[i].pressed ? "custombuttondown" : "custombuttonup";
            const event = new Event(eventType, {
                bubbles: true,
                cancelable: true,
            });
            event.button = buttonMap[i];
            event.player = playerNumber;
            event.key = keyMap[event.button][event.player - 1];
            document.dispatchEvent(event);
            player.buttons[i] = gamepad.buttons[i].pressed;
        }
    }
}
