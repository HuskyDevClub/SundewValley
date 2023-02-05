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

    obtainItem(key, num = 1) {
        this.#inventory[key] = this.#inventory[key] == null ? num : this.#inventory[key] + num
    }

    tryUseItem(key, num = 1) {
        if (this.#inventory[key] != null && this.#inventory[key] >= num) {
            this.#inventory[key] -= num
            if (this.#inventory[key] === 0) {
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