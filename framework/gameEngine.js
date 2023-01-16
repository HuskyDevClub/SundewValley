// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {

    #level

    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.Q = false;
        this.E = false;

    };

    init(ctx) {
        this.ctx = ctx;
        DateTimeSystem.init(2023);
        this.#level = new Level(`./levels/farm_${DateTimeSystem.getSeason()}.json`);
        this.#level.initEntities()
        this.startInput();
        this.timer = new Timer();
        Debugger.switchDebugMode();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        this.keyboardActive = false;
        let that = this;

        let getPixelXandY = function (e) {
            let x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return {x: x, y: y, radius: 0};
        }

        function mouseListener(e) {
            that.mouse = getPixelXandY(e);
        }

        function mouseClickListener(e) {
            that.click = getPixelXandY(e);
            if (Debugger.isDebugging) console.log(that.click);
        }

        function wheelListener(e) {
            e.preventDefault(); // Prevent Scrolling
            that.wheel = e.deltaY;
        }

        function keydownListener(e) {
            that.keyboardActive = true;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = true;
                    break;
                case "KeyQ":
                    that.Q = true;
                    break;
                case "KeyE":
                    that.E = true;
                    break;
            }
        }

        function keyUpListener(e) {
            that.keyboardActive = false;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = false;
                    break;
                case "KeyQ":
                    that.Q = false;
                    break;
                case "KeyE":
                    that.E = false;
                    break;
            }
        }

        that.mousemove = mouseListener;
        that.leftclick = mouseClickListener;
        that.wheelscroll = wheelListener;
        that.keydown = keydownListener;
        that.keyup = keyUpListener;

        this.ctx.canvas.addEventListener("mousemove", that.mousemove, false);

        this.ctx.canvas.addEventListener("click", that.leftclick, false);

        this.ctx.canvas.addEventListener("wheel", that.wheelscroll, false);

        this.ctx.canvas.addEventListener("keydown", that.keydown, false);

        this.ctx.canvas.addEventListener("keyup", that.keyup, false);
    };

    disableInput() {
        let that = this;
        that.ctx.canvas.removeEventListener("mousemove", that.mousemove);
        that.ctx.canvas.removeEventListener("click", that.leftclick);
        that.ctx.canvas.removeEventListener("wheel", that.wheelscroll);
        that.ctx.canvas.removeEventListener("keyup", that.keyup);
        that.ctx.canvas.removeEventListener("keydown", that.keydown);

        that.left = false;
        that.right = false;
        that.up = false;
        that.down = false;
        that.A = false;
        that.B = false;
    }

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