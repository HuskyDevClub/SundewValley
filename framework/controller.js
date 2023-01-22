class Controller {
    // basic move behaviors
    static up = false;
    static down = false;
    static left = false;
    static right = false;

    // Information on the input
    static click = null;
    static mouse = null;
    static wheel = null;
    static keys = {};
    static Q = false;
    static E = false;

    static keyboardActive = false;

    static startInput(_ctx) {
        let that = this;

        let getPixelXandY = function (e) {
            let x = e.clientX - _ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - _ctx.canvas.getBoundingClientRect().top;

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

        _ctx.canvas.addEventListener("mousemove", that.mousemove, false);

        _ctx.canvas.addEventListener("click", that.leftclick, false);

        _ctx.canvas.addEventListener("wheel", that.wheelscroll, false);

        _ctx.canvas.addEventListener("keydown", that.keydown, false);

        _ctx.canvas.addEventListener("keyup", that.keyup, false);
    };

    static clearMovement() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }
}