class Dialogues {
    static #CURRENT = null

    static #SCRIPTS = {
        Amely_interact1: {
            content: ["Hello my Name is Amely", "I can be used to test interaction", "What can I do for you?"]
        }
    }

    static isAnyDialoguePlaying() {
        return this.#CURRENT != null
    }

    static update(key) {
        this.#CURRENT = this.#SCRIPTS[key]
    }

    static draw(ctx) {
        if (this.isAnyDialoguePlaying()) {
            ctx.fillStyle = "#fbd09a"
            const boxRect = {
                x: 0,
                y: Math.ceil(ctx.canvas.height * 0.8),
                width: ctx.canvas.width,
                height: Math.ceil(ctx.canvas.height * 0.2)
            }
            ctx.fillRect(boxRect.x, boxRect.y, boxRect.width, boxRect.height);
            ctx.strokeStyle = "#2e1626"
            ctx.lineWidth = 6;
            ctx.strokeRect(boxRect.x + ctx.lineWidth / 2, boxRect.y - ctx.lineWidth / 2, boxRect.width - ctx.lineWidth, boxRect.height)
            ctx.lineWidth = 1;
            const textFontSize = Math.floor(ctx.canvas.height / 25)
            let lineIndex = 0
            this.#CURRENT.content.forEach(_l => {
                Font.draw(ctx, _l, textFontSize, boxRect.x + textFontSize, boxRect.y + textFontSize * (1.25 + lineIndex))
                lineIndex += 1.1;
            })
            Font.draw(ctx, "Next >>", Math.floor(ctx.canvas.height / 33), ctx.canvas.width * 0.89, ctx.canvas.height * 0.975)
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                if (this.#CURRENT.next == null) {
                    this.#CURRENT = null;
                }
            }
        }
    }
}