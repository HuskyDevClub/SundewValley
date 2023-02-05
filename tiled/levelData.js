class LevelData {

    static #DATA = {}

    static init() {
        this.#DATA = ASSET_MANAGER.getJsonByPath("./levels/levels.json")
    }

    static get(key) {
        return this.#DATA[key]
    }
}