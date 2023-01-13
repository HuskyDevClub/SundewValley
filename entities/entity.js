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
    #tile_w
    #tile_h

    constructor(category, type, subType, blockX, blockY) {
        this.#category = category
        this.#type = type
        this.#subType = subType
        this.#x = 0
        this.#y = 0
        this.#w = 0
        this.#h = 0
        this.removeFromWorld = false
        this.#tile_w = this.getJson()["tilewidth"]
        this.#tile_h = this.getJson()["tileheight"]
        this.setSize(this.#tile_w, this.#tile_h)
        this.setBlockX(blockX)
        this.setBlockY(blockY)
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
        return (this.#x + this.#w / 2) / Tile.getTileSize()
    }

    getBlockY() {
        return this.getPixelBottom() / Tile.getTileSize()
    }

    setBlockX(value) {
        this.setRight(value * Tile.getTileSize() + this.#w / 2)
    }

    setBlockY(value) {
        this.setPixelBottom(value * Tile.getTileSize())
    }

    getRight() {
        return this.#x + this.#w
    }

    getPixelBottom() {
        return this.#y + this.#h
    }

    setRight(right) {
        this.#x = right - this.#w
    }

    setPixelBottom(bottom) {
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

    getTileWidth() {
        return this.#tile_w
    }

    getTileHeight() {
        return this.#tile_h
    }

    setSize(width, height) {
        this.setWidth(width)
        this.setHeight(height)
    }

    collideWith(o) {
        return Math.max(this.getPixelX(), o.getPixelX()) < Math.min(this.getRight(), o.getRight()) && Math.max(this.getPixelY(), o.getPixelY()) < Math.min(this.getPixelBottom(), o.getPixelBottom())
    }
}