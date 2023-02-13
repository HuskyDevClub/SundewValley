class Transition {

    static #stage = 0
    static #currentRadius = 0
    static #job // stuff need to be done during a transition
    static #SPEED = 1000

    static isNotActivated() {
        return this.#stage === 0
    }

    static start(job = null) {
        this.#stage = 1;
        this.#currentRadius = 0
        this.#job = job
    }

    static draw(ctx) {
        if (this.isNotActivated()) return;
        const maxRadius = Math.ceil(Math.sqrt(Math.pow(ctx.canvas.width / 2, 2) + Math.pow(ctx.canvas.height / 2, 2)))
        const radius = maxRadius - this.#currentRadius
        ctx.fillStyle = "black";
        ctx.beginPath();
        if (this.#stage === 1) {
            if (radius >= 0) {
                ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, radius, 0, 2 * Math.PI);
                ctx.rect(ctx.canvas.width, 0, -ctx.canvas.width, ctx.canvas.height);
                ctx.fill();
                this.#currentRadius += Math.floor(GAME_ENGINE.clockTick * this.#SPEED);
            } else {
                ctx.rect(ctx.canvas.width, 0, -ctx.canvas.width, ctx.canvas.height);
                ctx.fill();
                this.#stage += 1
                this.#currentRadius = maxRadius
                if (this.#job != null) this.#job()
            }
        } else {
            if (radius <= maxRadius) {
                ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, radius, 0, 2 * Math.PI);
                ctx.rect(ctx.canvas.width, 0, -ctx.canvas.width, ctx.canvas.height);
                ctx.fill();
                this.#currentRadius -= Math.floor(GAME_ENGINE.clockTick * this.#SPEED);
            } else {
                this.#stage = 0
            }
        }
    }
}