class Controller {
    // basic move behaviors
    static up = false;
    static down = false;
    static left = false;
    static right = false;

    // Information on the input
    static click = null;
    static mouse = {x: 0, y: 0, radius: 0};
    static wheel = null;
    static keys = {};

    static keyboardActive = false;

    static startInput(_ctx) {
        let getPixelXandY = function (e) {
            let x = e.clientX - _ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - _ctx.canvas.getBoundingClientRect().top;

            return {x: x, y: y, radius: 0};
        }

        function mouseListener(e) {
            Controller.mouse = getPixelXandY(e);
        }

        function mouseClickListener(e) {
            Controller.click = getPixelXandY(e);
            if (Debugger.isDebugging) console.log(Controller.click);
        }

        function wheelListener(e) {
            e.preventDefault(); // Prevent Scrolling
            Controller.wheel = e.deltaY;
        }

        function keydownListener(e) {
            Controller.keyboardActive = true;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    Controller.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    Controller.right = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    Controller.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    Controller.down = true;
                    break;
                default:
                    Controller.keys[e.code] = true;
            }
        }

        function keyUpListener(e) {
            Controller.keyboardActive = false;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    Controller.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    Controller.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    Controller.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    Controller.down = false;
                    break;
                default:
                    Controller.keys[e.code] = false;
            }
        }

        Controller.mousemove = mouseListener;
        Controller.leftclick = mouseClickListener;
        Controller.wheelscroll = wheelListener;
        Controller.keydown = keydownListener;
        Controller.keyup = keyUpListener;

        _ctx.canvas.addEventListener("mousemove", Controller.mousemove, false);

        _ctx.canvas.addEventListener("click", Controller.leftclick, false);

        _ctx.canvas.addEventListener("wheel", Controller.wheelscroll, false);

        _ctx.canvas.addEventListener("keydown", Controller.keydown, false);

        _ctx.canvas.addEventListener("keyup", Controller.keyup, false);
    };

    static clearMovement() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }
}