import "../lib/player";

let vm;
let onQuit;

export function init(quit) {
    onQuit = quit;
    const canvas = document.querySelector("canvas");

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
}

export async function loadGame(game) {
    vm.stopAll();
    const response = await fetch(`games/${game.title}.sb3`);
    const buffer = await response.arrayBuffer();
    await vm.loadProject(buffer);
    vm.start();
}

export function greenFlag() {
    vm.greenFlag();
}

export function show() {
    document.querySelector("canvas").style.display = "initial";
}

export function hide() {
    document.querySelector("canvas").style.display = "none";
}


export function handleButtonDown(event) {
    vm.postIOData("keyboard", {
        key: event.key,
        isDown: true,
    });
}

export function handleButtonUp(event) {
    if (event.key === "Escape") {
        vm.stopAll();
        onQuit();
        return;
    }
    vm.postIOData("keyboard", {
        key: event.key,
        isDown: false,
    });
}
