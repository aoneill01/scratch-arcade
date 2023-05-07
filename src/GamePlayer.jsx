import { useEffect, useRef } from "react";
import "../lib/player";
import { games } from "./games";

export default function GamePlayer({ index = 0, onQuit }) {
  const canvas = useRef();
  const vm = useRef();
  const loading = useRef(null);
  const handleQuit = useRef();

  handleQuit.current = onQuit;

  if (index < 0) {
    index = games.length + (index % games.length);
  }
  index %= games.length;

  useEffect(() => {
    const initVM = () => {
      vm.current = new window.player.VirtualMachine();
      const renderer = new window.player.ScratchRender(canvas.current);
      canvas.current.width = document.body.clientWidth;
      canvas.current.height = (document.body.clientWidth * 360) / 480;
      if (canvas.current.height > document.body.clientHeight) {
        canvas.current.width = (document.body.clientHeight * 480) / 360;
        canvas.current.height = document.body.clientHeight;
      }
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
      const response = await fetch(`games/${name}.sb3`);
      const buffer = await response.arrayBuffer();
      await vm.current.loadProject(buffer);
      vm.current.start();
      vm.current.greenFlag();
    };

    const onKeyDown = (event) => {
      vm.current?.postIOData("keyboard", {
        key: event.key,
        isDown: true,
      });
    };

    const onKeyUp = (event) => {
      if (event.key === "Escape") {
        handleQuit.current();
        return;
      }
      vm.current?.postIOData("keyboard", {
        key: event.key,
        isDown: false,
      });
    };

    if (!vm.current) {
      initVM();
    }

    const game = games[index];
    if (loading.current !== game.title) {
      loading.current = game.title;
      loadGame(game.title);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [index]);

  return <canvas ref={canvas}></canvas>;
}
