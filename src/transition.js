import { gsap } from "gsap";
import { themes } from "./themes";

const size = 120;
const rows = 1080 / size;
const cols = 1920 / size;

const svg = document.getElementById('transition');

export function init() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', col * size);
            rect.setAttribute('y', row * size);
            rect.setAttribute('width', size + 2);
            rect.setAttribute('height', size + 2);
            rect.setAttribute('fill', themes.blue.stroke);
            rect.setAttribute('class', 'square');
            rect.setAttribute('style', 'transform-origin: center;')
            rect.dataset.delay = row + col;
            svg.appendChild(rect);
        }
    }
}

export async function hide() {
    const squares = svg.querySelectorAll(".square");
    const tl = gsap.timeline();
    for (const square of squares) {
      tl.fromTo(
        square,
        { scale: 0, opacity: 0.4, rotation: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, rotation: 180, duration: 1, delay: square.dataset.delay / 20 },
        0
      );
    }
    return tl;
}

export async function reveal() {
    const squares = svg.querySelectorAll(".square");
    const tl = gsap.timeline();
    for (const square of squares) {
      tl.fromTo(
        square,
        { scale: 1, opacity: 1, rotation: 180,  transformOrigin: 'center' },
        { scale: 0, opacity: 0.4, rotation: 0, duration: 1, delay: square.dataset.delay / 20 },
        0
      );
    }
    return tl; 
}
