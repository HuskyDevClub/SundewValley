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
        this.dialogContent = null
    };

    getCurrentLevel() {
        return this.#levels[this.#currentLevelName]
    }

    getPlayerUi() {
        return this.#ui
    }

    enterLevel(name) {
        this.#currentLevelName = name
        if (this.getCurrentLevel() == null) {
            const levelPath = `./levels/${name}.json`
            this.#levels[this.#currentLevelName] = name.startsWith("farm_") ? new FarmLevel(levelPath) : name.startsWith("bedroom") ? new Bedroom(levelPath) : new Level(levelPath)
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
        if (this.dialogContent != null) {
            this.ctx.fillStyle = "#fbd09a"
            const boxRect = {
                x: 0,
                y: Math.ceil(this.ctx.canvas.height * 0.8),
                width: this.ctx.canvas.width,
                height: Math.ceil(this.ctx.canvas.height * 0.2)
            }

            this.ctx.fillRect(boxRect.x, boxRect.y, boxRect.width, boxRect.height);
            this.ctx.strokeStyle = "#2e1626"
            this.ctx.lineWidth = 6;
            this.ctx.strokeRect(boxRect.x + this.ctx.lineWidth / 2, boxRect.y - this.ctx.lineWidth / 2, boxRect.width - this.ctx.lineWidth, boxRect.height)
            this.ctx.lineWidth = 1;
            const textFontSize = Math.floor(this.ctx.canvas.height / 25)
            let lineIndex = 0
            this.dialogContent.content.forEach(_l => {
                Font.draw(this.ctx, _l, textFontSize, boxRect.x + textFontSize, boxRect.y + textFontSize * (1.25 + lineIndex))
                lineIndex += 1.1;
            })
            Font.draw(this.ctx, "Next >>", Math.floor(this.ctx.canvas.height / 33), this.ctx.canvas.width * 0.89, this.ctx.canvas.height * 0.975)
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                if (this.dialogContent.next == null) {
                    this.dialogContent = null;
                }
            }
        }

        // Draw transition animation is it is activated
        Transition.draw(this.ctx)
    };

    update() {
        Debugger.update()
        DateTimeSystem.update(this.clockTick)
        if (Debugger.isDebugging) {
            Debugger.pushInfo(`current in game time: ${Math.round(this.timer.gameTime)}s`)
            Debugger.pushInfo(`Date: ${DateTimeSystem.toLocaleString()} ${DateTimeSystem.getSeason()}`)
            Debugger.pushInfo(`In Transition: ${!Transition.isNotActivated()}`)
        }
        this.getCurrentLevel().update()
        this.#ui.update()
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
        //Controller needs to be updated at the very end!
        Controller.update();
    };

}

// KV Le was here :)