// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {

    #levels
    #currentLevelName
    #ui

    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.#ui = null;
        this.#levels = {}
    };

    getCurrentLevel() {
        return this.#levels[this.#currentLevelName]
    }

    enterLevel(name) {
        this.#currentLevelName = name
        if (this.getCurrentLevel() == null) {
            this.#levels[this.#currentLevelName] = name.startsWith("farm_") ? new FarmLevel(`./levels/${name}.json`) : new Level(`./levels/${name}.json`)
            this.getCurrentLevel().initEntities()
        }
        this.#ui = new UserInterfaces();
    }

    init(ctx) {
        this.ctx = ctx;
        DateTimeSystem.init(2023);
        InventoryItems.init()
        LevelData.init()
        this.enterLevel("farm_test_level") // "town" `farm_${DateTimeSystem.getSeason()}`
        Controller.startInput(this.ctx)
        this.timer = new Timer();
        Debugger.switchDebugMode();
    };

    start() {
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };


    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // Draw the latest things first
        this.getCurrentLevel().draw(this.ctx)
        // Draw all the ui onto screen
        this.#ui.draw(this.ctx)
    };

    update() {
        Debugger.update()
        DateTimeSystem.update(this.clockTick)
        if (Debugger.isDebugging) {
            Debugger.pushInfo(`current in game time: ${Math.round(this.timer.gameTime)}s`)
            Debugger.pushInfo(`Date: ${DateTimeSystem.toLocaleString()} ${DateTimeSystem.getSeason()}`)
        }
        this.getCurrentLevel().update()
        this.#ui.update()
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

}

// KV Le was here :)