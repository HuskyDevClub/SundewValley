class Character extends Creature {

    #name
    #money

    constructor(name, type, x, y, mapRef) {
        super("characters", type, null, x, y, mapRef);
        this.#name = name
        this.setMoney(0)
    }

    getName() {
        return this.#name
    }

    getMoney() {
        return this.#money
    }

    setMoney(value) {
        this.#money = Math.max(value, 0)
    }
}