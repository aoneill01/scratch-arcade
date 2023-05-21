import { themes } from "./themes";

let wrap; // number of games in the rotation
let acceleration = 0;
let velocity = 0;
let offset = 0; // position offset in index units
let selected = 0; // selected game index
let floaters = [];
let gameList;
let selectGame;

export function init(games, handleSelectGame) {
    gameList = games;
    selectGame = handleSelectGame;

    const insertAfter = document.getElementById("picker-background");

    wrap = games.length;
    // Need a certain number of games
    while (wrap < 7) {
        wrap *= 2;
    }

    for (let i = 0; i < wrap; i++) {
        createBoxArt(games[i % games.length], i, insertAfter);
    }

    createFloater(0, 10, 60, themes.green, insertAfter);
    createFloater(80, 10.5, 650, themes.blue, insertAfter);
    createFloater(80, 12, 130, themes.yellow, insertAfter);
    createFloater(85, 14, 750, themes.red, insertAfter);
    createFloater(130, 18, 250, themes.pink, insertAfter);
    createFloater(0, 20, 1000, themes.orange, insertAfter);

    setGameDescription();
}

export function handleAnimationFrame(deltaTime, time) {
    // Apply physics
    let maxVelocity = 8;
    if (acceleration === 0) {
        velocity = 2000 * deltaTime * (selected - offset);
        maxVelocity = 4;
    } else {
        velocity += acceleration * deltaTime * 10;
    }
    velocity = Math.max(Math.min(velocity, maxVelocity), -maxVelocity);
    if (Math.abs(velocity) < 0.001) velocity = 0;
    offset += velocity * deltaTime;

    // Reposition a small number of boxes around the center
    const rounded = Math.round(offset);
    positionBox(((wrap + (rounded % wrap))) % wrap);
    for (let n = 1; n <= 4; n++) {
        positionBox(((wrap + ((rounded + n) % wrap))) % wrap);
        positionBox(((wrap + ((rounded - n) % wrap))) % wrap);
    }

    // Position floaters
    for (const floater of floaters) {
        const distance = +floater.dataset.distance;
        const delta = +floater.dataset.delta;
        const factor = 1 / floater.dataset.distance;
        floater.setAttribute(
            "transform",
            `translate(0, ${floater.dataset.y})
            translate(${wrapAround((960 - 500 * (offset + delta)) * factor, -300, 2000)}, 0)
            scale(${20 * factor})
            translate(0, ${14 * Math.sin(distance + time / 1000)})
            rotate(${11 * Math.sin(distance + time / 3100)})`
        );
    }
}

export function handleButtonDown(event) {
    switch (event.key) {
        case "ArrowLeft":
            acceleration = -1;
            selected = null;
            setGameDescription();
            break;
        case "ArrowRight":
            acceleration = 1;
            selected = null;
            setGameDescription();
            break;
        case " ":
            if (selected !== null) {
                selectGame(getSelectedGame());
            }
            break;
        default:
        // nothing
    }
}

export function handleButtonUp(event) {
    switch (event.key) {
        case "ArrowLeft":
            if (acceleration === -1) acceleration = 0;
            selected = Math.floor(offset);
            if ((selected - offset) / velocity < 0.03) selected--;
            setGameDescription();
            break;
        case "ArrowRight":
            if (acceleration === 1) acceleration = 0;
            selected = Math.ceil(offset);
            if ((selected - offset) / velocity < 0.03) selected++;
            setGameDescription();
            break;
        default:
        // nothing
    }
}

export function show() {
    document.querySelector(".App").style.display = "initial";
}

export function hide() {
    document.querySelector(".App").style.display = "none";
}

function createFloater(delta, distance, y, theme, insertAfter) {
    const svgNS = "http://www.w3.org/2000/svg";

    const g = document.createElementNS(svgNS, "g");
    g.dataset.delta = delta;
    g.dataset.distance = distance;
    g.dataset.y = y;

    const block = document.createElementNS(svgNS, "path");
    block.setAttribute("stroke", theme.stroke);
    block.setAttribute("fill", theme.fill);
    block.setAttribute("d", "m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 145.39197158813477 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z");
    block.setAttribute("style", "transform-origin: 150px 50px");
    g.appendChild(block);

    floaters.push(g);
    insertAfter.after(g);
}

function createBoxArt(game, index, insertAfter) {
    const svgNS = "http://www.w3.org/2000/svg";
    const orderedThemes = [themes.orange, themes.blue, themes.red, themes.green, themes.yellow, themes.pink];
    const theme = orderedThemes[index % orderedThemes.length];

    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("style", "transform-origin: 150px 400px");
    g.setAttribute("id", index);

    const background = document.createElementNS(svgNS, "rect");
    background.setAttribute("width", "300");
    background.setAttribute("height", "400");
    background.setAttribute("fill", theme.fill);
    g.appendChild(background);

    const art = document.createElementNS(svgNS, "image");
    art.setAttribute("href", `https://uploads.scratch.mit.edu/projects/thumbnails/${game.id}.png`);
    art.setAttribute("width", "260");
    art.setAttribute("height", "195");
    art.setAttribute("x", "20");
    art.setAttribute("y", "20");
    art.setAttribute("clip-path", "url(#artClip)");
    g.appendChild(art);

    const line1 = document.createElementNS(svgNS, "text");
    line1.setAttribute("x", "20");
    line1.setAttribute("y", "270");
    line1.setAttribute("transform", "skewY(-11)");
    line1.setAttribute("class", "title");
    line1.setAttribute("fill", "white");
    g.appendChild(line1);

    const line2 = document.createElementNS(svgNS, "text");
    line2.setAttribute("x", "20");
    line2.setAttribute("y", "312");
    line2.setAttribute("transform", "skewY(-11)");
    line2.setAttribute("class", "title");
    line2.setAttribute("fill", "white");
    g.appendChild(line2);

    const bottomBar = document.createElementNS(svgNS, "rect");
    bottomBar.setAttribute("width", "300");
    bottomBar.setAttribute("height", "60");
    bottomBar.setAttribute("y", "340");
    bottomBar.setAttribute("fill", "white");
    g.appendChild(bottomBar);

    const logo = document.createElementNS(svgNS, "image");
    logo.setAttribute("href", "https://raw.githubusercontent.com/LLK/scratch-www/develop/static/images/logo_sm.png");
    logo.setAttribute("width", "160");
    logo.setAttribute("x", "120");
    logo.setAttribute("y", "312");
    g.appendChild(logo);

    const cc = document.createElementNS(svgNS, "image");
    cc.setAttribute("href", "https://mirrors.creativecommons.org/presskit/icons/cc.svg");
    cc.setAttribute("width", "30");
    cc.setAttribute("height", "30");
    cc.setAttribute("x", "20");
    cc.setAttribute("y", "354");
    g.appendChild(cc);

    insertAfter.after(g);
    setTitle(line1, line2, game.title);
    positionBox(index);
}

function positionBox(index) {
    const g = document.getElementById(index);
    const x = getX(index, offset);
    const scale = getScale(index, offset);
    g.setAttribute("transform", `translate(${x}, 300) scale(${scale})`);
}

function getWrappedFromCenter(index) {
    let position = (wrap + ((index - offset) % wrap)) % wrap;
    if (position > wrap / 2) {
        position -= wrap;
    }
    return position;
}

function getX(index) {
    const boxWidth = 300;
    const boxMargin = 20;
    const screenWidth = 1920;
    const middle = (screenWidth - boxWidth) / 2;

    return middle + (boxMargin + boxWidth) * getWrappedFromCenter(index, offset);
}

function getScale(index) {
    const distance = Math.abs(getWrappedFromCenter(index, offset));
    const maxDistance = 2.1;
    if (distance > maxDistance) return 0.8;
    const factor = -(Math.cos((Math.PI * distance) / maxDistance) - 1) / 2;
    return 1 - 0.2 * factor;
}

function setTitle(line1, line2, title) {
    line1.textContent = title;

    let lastSpace;
    let line1LastIndex;

    for (let i = 1; i < title.length; i++) {
        if (title[i] === " ") {
            lastSpace = i;
            continue;
        }
        if (line1.getSubStringLength(0, i + 1) > 260) {
            line1LastIndex = lastSpace ? lastSpace : i - 1;
            line1.textContent = title.substring(0, line1LastIndex);
            break;
        }
    }

    if (!line1LastIndex) {
        return;
    }

    line2.textContent = title.substring(line1LastIndex).trim();

    for (let i = 1; i < line2.textContent.length; i++) {
        if (line2.getSubStringLength(0, i + 1) > 260) {
            line2.textContent = line2.textContent.substring(0, i - 1);
            return;
        }
    }
}

function wrapAround(value, min, max) {
    const range = max - min;
    let fromMin = value - min;

    if (fromMin < 0) {
        fromMin = range + (fromMin % range);
    }
    fromMin %= range;
    return fromMin + min;
}

function getSelectedGame() {
    return gameList[(gameList.length + (selected % gameList.length)) % gameList.length];
}

function setGameDescription() {
    const div = document.getElementById("game-description");

    if (selected === null) {
        div.innerText = "";
        return;
    }

    div.innerText = getSelectedGame().title;
}
