const monitorsDiv = document.getElementById("monitors");
const canvas = document.getElementById("game-canvas");

export function reset() {
  monitorsDiv.innerHTML = "";
}

export function updateMonitors(monitors, vm) {
  for (const monitor of monitors.values()) {
    if (!monitor.visible) {
      let elem = document.getElementById(monitor.id);
      if (elem) elem.remove();
      continue;
    }

    let elem = document.getElementById(monitor.id);
    if (!elem) {
      elem = document.createElement("div");
      elem.setAttribute("id", monitor.id);

      elem.style.left = `${canvas.offsetLeft + (canvas.clientWidth * monitor.x) / 480}px`;
      elem.style.top = `${canvas.offsetTop + (canvas.clientHeight * monitor.y) / 360}px`;
      monitorsDiv.appendChild(elem);
    }

    elem.innerText = `${getLabel(monitor)}: ${monitor.value}`;
  }
}

function getLabel(monitor) {
  switch (monitor.opcode) {
    case "data_variable":
      return monitor.params.VARIABLE;
    case "data_listcontents":
      return monitor.params.LIST;
    default:
      return monitor.opcode;
  }
}
