const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

const JSON_MANAGER = new JsonManager();

fetch("./additional.json")
    .then(response => response.json())
    .then(data => {
        Array.from(data["jsons"]).forEach(_path => {
            JSON_MANAGER.queueDownload(_path);
        });
        Array.from(data["images"]).forEach(_path => {
            ASSET_MANAGER.queueDownload(_path);
        });
        JSON_MANAGER.downloadAll(() => {
            ASSET_MANAGER.downloadAll(() => {
                const canvas = document.getElementById("gameWorld");
                const ctx = canvas.getContext("2d");
                gameEngine.init(ctx);
                gameEngine.start();
            })
        })
    })
    .catch(error => {
        console.error(`Fatal Error: cannot load additional.json - ${error}`);
    })
