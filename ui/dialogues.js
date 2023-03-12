class Dialogues {
    static #CURRENT = null
    static #CURRENT_INIT_BY = null

    static #SCRIPTS = {
        Amely_interact1: {
            contents: ["Hello my Name is Amely", "What can I do for you, my dear customer?"],
            options: [{
                text: "I want to see what you have",
                act: "$trade"
            }, {
                text: "Nothing, have a nice day",
                act: "$close"
            }]
        },
        Mark_interact1: {
            contents: ["Hey, I am not in the mood of doing business right now", "Go away"],
            options: [{
                text: "Sorry",
                act: "$close"
            }]
        },
        Yu_interact1: {
            contents: ["Greeting, want something to drink?"],
            options: [{
                text: "Sure, what do you have",
                act: "Yu_interact2"
            }, {
                text: "No, thanks",
                act: "$close"
            }]
        },
        Yu_interact2: {
            contents: ["We have... water."],
            options: [{
                text: "And...??",
                act: "Yu_interact3"
            }]
        },
        Yu_interact3: {
            contents: ["And that is it"],
            options: [{
                text: "What kinds of bar only serves water?",
                act: "Yu_interact4"
            }]
        },
        Yu_interact4: {
            contents: ["Well... we do."],
            options: [{
                text: "Never mind, have a nice day",
                act: "%close"
            }, {
                text: "Ok, I will have some water",
                act: "Yu_interact5"
            }]
        },
        Yu_interact5: {
            contents: ["Here you go, have a nice day"],
        },
        Adian_interact1: {
            contents: ["Hey you, yeah I am talking to you", "Come here"],
            next: "Adian_interact2"
        },
        Adian_interact2: {
            contents: ["This is so stupid", "Have you ever see a bar that only serves water?"],
            options: [{
                text: "Well, water is good for your health",
                act: "Adian_interact2_disagree"
            }, {
                text: "It is kind of strange",
                act: "Adian_interact2_agree"
            }]
        },
        Adian_interact2_agree: {
            contents: ["Finally, there are still smart people on this plant", "I thought I am the one one left"],
        },
        Adian_interact2_disagree: {
            contents: ["Well go away then", "There is no reason for me to talk to someone like you"],
        },
        Marx_interact1: {
            contents: ["Hello stranger", "Never see you here before", "Where do you come from?"],
            next: "Marx_interact2"
        },
        Marx_interact2: {
            contents: ["Hmm interesting", "Just move here and inherit a farm from a recent died relative?", "Sounds like something that will only come out of a video game"],
            next: "Marx_interact3"
        },
        Marx_interact3: {
            contents: ["You see, I think it is great that there is a bar out here", "that only serves water", "Alcohol will only cause problem"],
            next: "Marx_interact4"
        },
        Marx_interact4: {
            contents: ["Young people these days do not understand the importance", "of taking care of their bodies", "You are not someone like that, aren't you?"],
        },
        Bar_TV1_1: {
            contents: ["The TV is airing the latest weather report"],
            next: "Bar_TV1_2"
        },
        Bar_TV1_2: {
            contents: ["It seems like tomorrow will be another sunny day"],
        },
        Bar_TV2_1: {
            contents: ["An old TV", "Do you want to turn it on?"],
            options: [{
                text: "Yes",
                act: "Bar_TV2_2"
            }, {
                text: "No",
                act: "$close"
            }]
        },
        Bar_TV2_2: {
            contents: ["The screen is still black", "The TV seems to be broken"],
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
                    } else {
                        this.update(this.#CURRENT.next, this.#CURRENT_INIT_BY)
                    }
                } else if (currentHover >= 0) {
                    if (this.#CURRENT["options"][currentHover].act.startsWith("$")) {
                        if (this.#CURRENT["options"][currentHover].act.localeCompare("$close") === 0) {
                            this.#CURRENT = null;
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$trade") === 0) {
                            this.#CURRENT = null;
                            GAME_ENGINE.getPlayerUi().startATrade(this.#CURRENT_INIT_BY);
                        }
                    } else {
                        this.update(this.#CURRENT["options"][currentHover].act, this.#CURRENT_INIT_BY)
                    }
                }
            }
        }
    }
}