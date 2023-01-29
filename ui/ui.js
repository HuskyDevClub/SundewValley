class UserInterfaces {
    #inventory = null

    constructor(_level) {
        this.#inventory = new Inventory(_level.getPlayer())
    }

    update() {
        this.#inventory.isVisiable = Controller.keys["KeyI"]
    }

    draw(ctx) {
        this.#inventory.draw(ctx)
    }
}