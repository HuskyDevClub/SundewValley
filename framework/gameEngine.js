// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {

    #level

    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
    };

    init(ctx) {
        this.ctx = ctx;
        DateTimeSystem.init(2023);
        this.#level = new FarmLevel(`./levels/farm_${DateTimeSystem.getSeason()}.json`);
        //this.#level = new FarmLevel(`./levels/test_level.json`);
        this.#level.initEntities()
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
        this.#level.draw(this.ctx)
    };

    update() {
        Debugger.update()
        DateTimeSystem.update(this.clockTick)
        if (Debugger.isDebugging) {
            Debugger.pushInfo(`current in game time: ${Math.round(this.timer.gameTime)}s`)
            Debugger.pushInfo(`Date: ${DateTimeSystem.toLocaleString()} ${DateTimeSystem.getSeason()}`)
        }

        this.#level.update()
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

}

// KV Le was here :)