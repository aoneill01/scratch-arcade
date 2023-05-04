import { useEffect, useRef } from "react";
import "../lib/player";
import { games } from "./games";

export default function GamePlayer({ index = 0 }) {
  const canvas = useRef();
  const vm = useRef();
  const loading = useRef(null);

  if (index < 0) {
    index = games.length + index % games.length;
  }
  index %= games.length;

  useEffect(() => {
    const initVM = () => {
      vm.current = new window.player.VirtualMachine();
      const renderer = new window.player.ScratchRender(canvas.current);
    //   canvas.current.width = "960";
    //   canvas.current.height = "720";
      const audioEngine = new window.player.AudioEngine();
      const storage = new window.player.ScratchStorage();
      const AssetType = storage.AssetType;
      const ScratchSVGRenderer = window.player.ScratchSVGRenderer;

      storage.addWebStore(
        [AssetType.Project, AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound],
        (asset) => `/games/${asset.assetId}.${asset.dataFormat}`
      );
      vm.current.attachStorage(storage);

      vm.current.attachRenderer(renderer);
      vm.current.attachAudioEngine(audioEngine);
      vm.current.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());
      vm.current.setCompatibilityMode(true);
    };

    const loadGame = async (name) => {
      vm.current.stopAll();
      const response = await fetch(`/games/${name}.sb3`);
      const buffer = await response.arrayBuffer();
      await vm.current.loadProject(buffer);
      vm.current.start();
      vm.current.greenFlag();
    };

    if (!vm.current) {
      initVM();
    }

    const game = games[index];
    if (loading.current !== game.title) {
        loading.current = game.title;
        loadGame(game.title);
    }
  }, [index]);

  return <canvas ref={canvas}></canvas>;
}
