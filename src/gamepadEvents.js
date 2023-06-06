const buttonMap = {
    [0]: "A",
    [1]: "B",
    [2]: "X",
    [3]: "Y",
    [4]: "C",
    [5]: "Z",
    [8]: "Stop",
    [9]: "Start",
    [12]: "Up",
    [13]: "Down",
    [14]: "Left",
    [15]: "Right",
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
            document.dispatchEvent(event);
            player.buttons[i] = gamepad.buttons[i].pressed;
        }
    }
}
