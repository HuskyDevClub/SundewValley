class Entity {
    #category
    #type
    #subType
    #sprite_sheet = null
    #json = null
    #x
    #y
    #w
    #h
    #direction_facing = "r"


    constructor(category, type, subType, x, y) {
        this.#category = category
        this.#type = type
        this.#subType = subType
        this.#x = x
        this.#y = y
        this.#w = 0
        this.#h = 0
        this.removeFromWorld = false
        this.setSize(this.getJson()["tilewidth"], this.getJson()["tileheight"])

    }

    getSpriteSheet() {
        if (this.#sprite_sheet == null) {
            this.#sprite_sheet = ASSET_MANAGER.getAsset(this.getSubType() ? `./images/${this.getCategory()}/${this.getType()}/${this.getSubType()}.png` : `./images/${this.#category}/${this.#type}.png`)
        }
        return this.#sprite_sheet
    }

    getJson() {
        if (this.#json == null) {
            this.#json = JSON_MANAGER.getJson(this.getSubType() ? `./images/${this.#category}/${this.#type}/${this.#type}.json` : `./images/${this.#category}/${this.#type}.json`)
        }
        return this.#json
    }

    getCategory() {
        return this.#category
    }

    getType() {
        return this.#type
    }

    getSubType() {
        return this.#subType
    }

    getPixelX() {
        return this.#x
    }

    getPixelY() {
        return this.#y
    }

    setPixelX(x) {
        this.#x = x
    }

    setPixelY(y) {
        this.#y = y
    }

    getBlockX() {
        return this.#x / Tile.getTileSize()
    }

    getBlockY() {
        return this.#y / Tile.getTileSize()
    }

    getRight() {
        return this.#x + this.#w
    }

    getBottom() {
        return this.#y + this.#h
    }

    setRight(right) {
        this.#x = right - this.#w
    }

    setBottom(bottom) {
        this.#y = bottom - this.#h
    }

    getWidth() {
        return this.#w
    }

    getHeight() {
        return this.#h
    }

    setWidth(width) {
        this.#w = parseInt(width)
    }

    setHeight(height) {
        this.#h = parseInt(height)
    }

    setSize(width, height) {
        this.setWidth(width)
        this.setHeight(height)
    }

    getDirectionFacing() {
        return this.#direction_facing;
    }

    setDirectionFacing(dirt) {
        this.#direction_facing = dirt;
    }
}