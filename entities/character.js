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

    earnMoney(value) {
        this.#money += value
    }

    getInventory() {
        return this.#inventory
    }

    hasItemInInventory(key) {
        return this.getInventory()[key] != null
    }

    obtainItem(key, num = 1) {
        if (this.hasItemInInventory(key)) {
            this.getInventory()[key]["amount"] += num
        } else {
            this.getInventory()[key] = {"amount": num}
        }
    }

    takeItemOutOfTargetInventory(key, targetRef, amount = null) {
        if (amount == null || amount > targetRef.getInventory()[key]["amount"]) {
            amount = targetRef.getInventory()[key]["amount"]
        }
        targetRef.tryUseItem(key, amount)
        this.obtainItem(key, amount)
    }

    putItemFromInventoryIntoTargetInventory(key, targetRef, amount = null) {
        if (amount == null || amount > this.getInventory()[key]["amount"]) {
            amount = this.getInventory()[key]["amount"]
        }
        targetRef.obtainItem(key, amount)
        this.tryUseItem(key, amount)
    }

    tryUseItem(key, num = 1) {
        if (this.hasItemInInventory(key) != null && this.getInventory()[key]["amount"] >= num) {
            this.getInventory()[key]["amount"] -= num
            if (this.getInventory()[key]["amount"] === 0) {
                delete this.getInventory()[key]
            }
            return true
        }
        return false;
    }

    setMoney(value) {
        this.#money = Math.max(value, 0)
    }
}