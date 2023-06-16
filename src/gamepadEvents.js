const buttonMap = {
    [0]: "A",
    [1]: "B",
    [2]: "X",
    [3]: "Y",
    [4]: "Z",
    [5]: "C",
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
        player.buttons[12] = false;
        player.buttons[13] = false;
        player.buttons[14] = false;
        player.buttons[15] = false;
        return;
    }

    for (const i of Object.keys(buttonMap)) {
        let button;
        if (i < 12) {
            button = gamepad.buttons[i].pressed;
        } else if (+i === 12) {
            button = isUp(gamepad);
        } else if (+i === 13) {
            button = isDown(gamepad);
        } else if (+i === 14) {
            button = isLeft(gamepad);
        } else if (+i === 15) {
            button = isRight(gamepad);
        }
        if (button !== player.buttons[i]) {
            const eventType = button ? "custombuttondown" : "custombuttonup";
            const event = new Event(eventType, {
                bubbles: true,
                cancelable: true,
            });
            event.button = buttonMap[i];
            event.player = playerNumber;
            document.dispatchEvent(event);
            player.buttons[i] = button;
            
        }
    }
}

function isUp(gamepad) {
    return gamepad.axes[1] < -.5;
}


function isDown(gamepad) {
    return gamepad.axes[1] > .5;
}

function isLeft(gamepad) {
    return gamepad.axes[0] < -.5;
}

function isRight(gamepad) {
    return gamepad.axes[0] > .5;
}