class UserInterfaces {
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

    isNotOpeningAnyChest() {
        return this.#UI.chest == null
    }

    closeChest() {
        this.#UI.chest = null
    }

    update() {
        if (this.#UI.chest != null) {
            this.#CURRENT = this.#UI.chest
        } else if (Controller.keys["KeyI"]) {
            this.#CURRENT = this.#UI.inventory
        } else {
            this.#CURRENT = this.#UI.itemBar
        }
    }

    draw(ctx) {
        this.#CURRENT.draw(ctx)
    }
}