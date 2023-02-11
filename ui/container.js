class GameObjectsMapContainer extends GameObject2d {
    #items_container_map
    #item_being_hovered

    constructor(containerRef = {}) {
        super(0, 0, 0, 0)
        this.#items_container_map = containerRef
        this.#item_being_hovered = null
    }

    getNumOfItems() {
        return Object.keys(this.#items_container_map).length
    }

    clear() {
        this.#items_container_map.length = 0
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

    draw(ctx) {
        this.#item_being_hovered = null
    }

}