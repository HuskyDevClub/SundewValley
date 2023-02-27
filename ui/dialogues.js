class Dialogues {
    static #CURRENT = null
    static #CURRENT_INIT_BY = null

    static #SCRIPTS = {
        Amely_interact1: {
            contents: ["Hello my Name is Amely", "I can be used to test interaction", "What can I do for you?"],
            options: [{
                text: "I want to Trade",
                act: "$trade"
            }, {
                text: "Nothing, have a nice day",
                act: "$close"
            }]
        }
    }

    static isAnyDialoguePlaying() {
        return this.#CURRENT != null
    }

    static update(key, initBy) {
        this.#CURRENT = this.#SCRIPTS[key]
        this.#CURRENT_INIT_BY = initBy
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
            this.#CURRENT.contents.forEach(_l => {
                Font.draw(ctx, _l, textFontSize, boxRect.x + textFontSize, boxRect.y + textFontSize * (1.25 + lineIndex))
                lineIndex += 1.1;
            })
            const hasNoOption = this.#CURRENT["options"] == null || this.#CURRENT["options"].length <= 0
            let currentHover = -1
            if (hasNoOption) {
                Font.draw(ctx, ">>", Math.floor(ctx.canvas.height / 33), ctx.canvas.width * 0.95, ctx.canvas.height * 0.975)
            } else {
                for (let i = 0, l = this.#CURRENT["options"].length; i < l; i++) {
                    if (MessageButton.draw(
                        ctx, this.#CURRENT["options"][i]["text"], textFontSize,
                        ctx.canvas.width * 0.925 - Font.measure(ctx, this.#CURRENT["options"][i]["text"]).width, boxRect.y - textFontSize * (l - i) * 2 - textFontSize / 2
                    )) {
                        currentHover = i
                    }
                }
            }
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                if (hasNoOption) {
                    if (this.#CURRENT.next == null) {
                        this.#CURRENT = null;
                    }
                } else if (currentHover >= 0) {
                    if (this.#CURRENT["options"][currentHover].act.localeCompare("$close") === 0) {
                        this.#CURRENT = null;
                    } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$trade") === 0) {
                        this.#CURRENT = null;
                        GAME_ENGINE.getPlayerUi().startATrade(this.#CURRENT_INIT_BY);
                    }
                }
            }
        }
    }
}