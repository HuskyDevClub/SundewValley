class Character extends Creature {

    #name
    #money
    #inventory

    constructor(name, type, x, y, mapRef) {
        super("characters", type, null, x, y, mapRef);
        this.#name = name
        this.#inventory = {}
        this.setMoney(0)
    }

    getName() {
        return this.#name
    }

    getMoney() {
        return this.#money
    }

    getInventory() {
        return this.#inventory
    }

    hasItemInInventory(key) {
        return this.#inventory[key] != null
    }

    obtainItem(key, num = 1) {
        if (this.hasItemInInventory(key)) {
            this.#inventory[key]["amount"] += num
        } else {
            this.#inventory[key] = {"amount": num}
        }
    }

    tryUseItem(key, num = 1) {
        if (this.hasItemInInventory(key) != null && this.#inventory[key]["amount"] >= num) {
            this.#inventory[key]["amount"] -= num
            if (this.#inventory[key]["amount"] === 0) {
                delete this.#inventory[key]
            }
            return true
        }
        return false;
    }

    setMoney(value) {
        this.#money = Math.max(value, 0)
    }
}