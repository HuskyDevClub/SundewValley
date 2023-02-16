class UserInterfaces {
    #UI = {}
    #CURRENT

    constructor() {
        GUI.init()
        this.#UI.chest = new Chest(Level.PLAYER)
        this.#UI.itemBar = new ItemBar(Level.PLAYER)
        this.#UI.inventory = new Inventory(Level.PLAYER)
        this.#CURRENT = this.#UI.itemBar
    }

    update() {
        if (Controller.keys["KeyI"]) {
            this.#CURRENT = this.#UI.inventory
        } else if (Controller.keys["KeyE"]) {
            this.#CURRENT = this.#UI.chest
        } else {
            this.#CURRENT = this.#UI.itemBar
        }
    }

    draw(ctx) {
        this.#CURRENT.draw(ctx)
    }
}