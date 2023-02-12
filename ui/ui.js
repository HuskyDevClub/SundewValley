class UserInterfaces {
    #inventory = null

    constructor() {
        GUI.init()
        this.#inventory = new Inventory(Level.PLAYER)
    }

    update() {
        this.#inventory.isInventoryUIVisible = Controller.keys["KeyI"]
    }

    draw(ctx) {
        this.#inventory.draw(ctx)
    }
}