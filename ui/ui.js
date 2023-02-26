class UserInterfaces {
    static displayTitle = true
    #UI = {}
    #CURRENT

    constructor() {
        GUI.init()
        this.#UI.chest = null
        this.#UI.itemBar = new ItemBarUI(Level.PLAYER)
        this.#UI.inventory = new InventoryUI(Level.PLAYER)
        this.#CURRENT = this.#UI.itemBar
    }

    openChest(chestRef) {
        this.#UI.chest = new ChestUI(Level.PLAYER, chestRef)
    }

    startATrade(targetUI) {
        this.#UI.trade = new TradeUI(Level.PLAYER, targetUI)
    }

    noUiIsOpening() {
        return this.#UI.chest == null && this.#UI.trade == null
    }

    closeChest() {
        this.#UI.chest = null
    }

    update() {
        if (UserInterfaces.displayTitle === true) return
        if (this.#UI.chest != null) {
            this.#CURRENT = this.#UI.chest
        } else if (this.#UI.trade != null) {
            if (this.#UI.trade.isOpening) {
                this.#CURRENT = this.#UI.trade
            } else {
                this.#UI.trade = null
            }
        } else if (!this.#UI.inventory.isOpening) {
            if (Controller.keys["KeyI"]) {
                this.#CURRENT = this.#UI.inventory
                this.#UI.inventory.isOpening = true
            } else {
                this.#CURRENT = this.#UI.itemBar
            }
        }
    }

    draw(ctx) {
        if (UserInterfaces.displayTitle === true) {
            const _width = ctx.canvas.width * 0.8
            const _height = ctx.canvas.height * 0.2
            ctx.drawImage(ASSET_MANAGER.getImage("ui", "title.png"), (ctx.canvas.width - _width) / 2, ctx.canvas.height * 0.2, _width, _height)
            if (MessageButton.draw(ctx, "Start", ctx.canvas.height * 0.05, ctx.canvas.width * 0.425, ctx.canvas.height * 0.6) && !Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                Transition.start(() => {
                    GAME_ENGINE.enterLevel("farm")
                    Level.PLAYER.setMapReference(GAME_ENGINE.getCurrentLevel())
                    GAME_ENGINE.getCurrentLevel().goToSpawn()
                    UserInterfaces.displayTitle = false
                })
            }
        } else {
            this.#CURRENT.draw(ctx)
        }
    }
}