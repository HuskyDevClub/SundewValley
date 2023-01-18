const GAME_ENGINE = new GameEngine();

const ASSET_MANAGER = new AssetManager();

fetch("./additional.json")
    .then(response => response.json())
    .then(data => {
        Array.from(data["jsons"]).forEach(_path => {
            ASSET_MANAGER.queueDownloadJson(_path);
        });
        Array.from(data["images"]).forEach(_path => {
            ASSET_MANAGER.queueDownloadImage(_path);
        });
        ASSET_MANAGER.downloadAll(() => {
            const canvas = document.getElementById("gameWorld");
            const ctx = canvas.getContext("2d");
            // disable image smoothing since this is a pixel game
            ctx.imageSmoothingEnabled = false
            GAME_ENGINE.init(ctx);
            GAME_ENGINE.start();
        })
    })
    .catch(error => {
        console.error(`Fatal Error: cannot load additional.json - ${error}`);
    })
