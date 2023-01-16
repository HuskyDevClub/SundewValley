class Character extends Creature {

    #name
    #money

    constructor(name, type, x, y) {
        super("characters", type, null, x, y);
        this.#name = name
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