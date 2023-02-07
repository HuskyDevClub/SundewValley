class UserInterfaces {
    #inventory = null

    constructor() {
        this.#inventory = new Inventory(Level.PLAYER)
    }

    update() {
        this.#inventory.isVisiable = Controller.keys["KeyI"]
    }

    draw(ctx) {
        this.#inventory.draw(ctx)
    }
}