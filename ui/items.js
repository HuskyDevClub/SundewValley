class InventoryItems {

    static #ITEMS_SPRITE_SHEET
    static #PIXEL_SIZE
    static #LOCATIONS = {
        "pumpkin": [0, 0],
        "cabbage": [1, 0],
        "carrot": [2, 0],
        "grain": [3, 0],
        "potato": [4, 0],
        "strawberry": [5, 0],
        "tomato": [6, 0],
        "eggplant": [7, 0],
        "lavender": [8, 0],
        "corn": [9, 0],
        "pea": [9, 2],
        "pumpkin_seed": [0, 1],
        "cabbage_seed": [1, 1],
        "carrot_seed": [2, 1],
        "grain_seed": [3, 1],
        "potato_seed": [4, 1],
        "strawberry_seed": [5, 1],
        "tomato_seed": [6, 1],
        "eggplant_seed": [7, 1],
        "lavender_seed": [8, 1],
        "corn_seed": [9, 1],
        "pea_seed": [9, 3],
        "pot": [0, 3],
        "axe": [0, 4],
        "hoe": [3, 4]
    }

    static init() {
        this.#ITEMS_SPRITE_SHEET = ASSET_MANAGER.getImage("items", "items.png")
        this.#PIXEL_SIZE = ASSET_MANAGER.getJson("images", "items", "items.json")["tilewidth"]
    }

    // if an item can be used
    static isUsable(key) {
        return key.endsWith("seed")
    }

    static drawImage(ctx, key, pixelX, pixelY, width, height, offsetTileX = 0, offsetTileY = 0) {
        const _loc = this.#LOCATIONS[key]
        ctx.drawImage(this.#ITEMS_SPRITE_SHEET, (_loc[0] + offsetTileX) * this.#PIXEL_SIZE, (_loc[1] + offsetTileY) * this.#PIXEL_SIZE, this.#PIXEL_SIZE, this.#PIXEL_SIZE, pixelX, pixelY, width, height)
    }
}

