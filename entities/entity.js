class Entity extends GameObject2d {
    static #uid_counter = 0
    #category
    #type
    #subType
    #sprite_sheet = null
    #json = null
    #tile_w
    #tile_h
    #uid

    constructor(category, type, subType, blockX, blockY) {
        super(0, 0, 0, 0)
        this.#category = category
        this.#type = type
        this.#subType = subType
        this.removeFromWorld = false
        this.#tile_w = this.getJson()["tilewidth"]
        this.#tile_h = this.getJson()["tileheight"]
        this.#uid = ++Entity.#uid_counter
        this.setSize(this.#tile_w, this.#tile_h)
        this.setBlockX(blockX)
        this.setBlockY(blockY)
    }

    getUid() {
        return this.#uid
    }

    getSpriteSheet() {
        if (this.#sprite_sheet == null) {
            this.#sprite_sheet = this.getSubType() ? ASSET_MANAGER.getImage(this.getCategory(), this.getType(), `${this.getSubType()}.png`) : ASSET_MANAGER.getImage(this.getCategory(), `${this.getType()}.png`)
        }
        return this.#sprite_sheet
    }

    getJson() {
        if (this.#json == null) {
            this.#json = this.getSubType() ? ASSET_MANAGER.getJson("images", this.getCategory(), this.getType(), `${this.getType()}.json`) : ASSET_MANAGER.getJson("images", this.getCategory(), `${this.getType()}.json`)
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

    getBlockX() {
        return (this.getPixelX() + this.getWidth() / 2) / Level.getTileSize()
    }

    getBlockY() {
        return this.getPixelBottom() / Level.getTileSize()
    }

    setBlockX(value) {
        this.setPixelRight(value * Level.getTileSize() + this.getWidth() / 2)
    }

    setBlockY(value) {
        this.setPixelBottom(value * Level.getTileSize())
    }

    getTileWidth() {
        return this.#tile_w
    }

    getTileHeight() {
        return this.#tile_h
    }

    collideWith(o) {
        return Math.max(this.getPixelX(), o.getPixelX()) < Math.min(this.getPixelRight(), o.getPixelRight()) && Math.max(this.getPixelY(), o.getPixelY()) < Math.min(this.getPixelBottom(), o.getPixelBottom())
    }
}