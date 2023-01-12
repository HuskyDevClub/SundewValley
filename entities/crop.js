class Crop extends Entity {
    static #crops_sprite_sheet = null
    #stage

    constructor(type, subType, x, y) {
        super("crops", type, null, x, y);
        this.#stage = 0
    }
}