class Character extends Creature {

    #name

    constructor(name, type, x, y) {
        super("characters", type, null, x, y);
        this.#name = name
    }

    getName() {
        return this.#name
    }

}