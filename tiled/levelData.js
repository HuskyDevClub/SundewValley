class LevelData {

    static #DATA = {}

    static init() {
        this.#DATA = ASSET_MANAGER.getJson("levels", "levels.json")
    }

    static get(key) {
        return this.#DATA[key]
    }
}