class GameObjectsMapContainer extends GameObject2d {
    #items_container_map
    #item_being_hovered

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.#items_container_map = {}
        this.#item_being_hovered = null
    }

    getNumOfItems() {
        return this.#items_container_map.length
    }

    clear() {
        this.#items_container_map = {}
    }

    isEmpty() {
        return this.getNumOfItems() <= 0
    }

    getItemBeingHovered() {
        return this.#item_being_hovered
    }

    keys() {
        return Object.keys(this.#items_container_map)
    }

    get(key) {
        return this.#items_container_map[key]
    }

    set(key, value) {
        this.#items_container_map[key] = value
    }

    remove(key) {
        delete this.#items_container_map[key]
    }

    contain(key) {
        return key in this.#items_container_map
    }

    update() {

    }

    display(ctx, offsetX, offsetY) {
        this.#item_being_hovered = null
    }

}