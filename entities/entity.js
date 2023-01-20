class Entity extends GameObject2d {
    #category
    #type
    #subType
    #sprite_sheet = null
    #json = null
    #tile_w
    #tile_h

    constructor(category, type, subType, blockX, blockY) {
        super(0, 0, 0, 0)
        this.#category = category
        this.#type = type
        this.#subType = subType
        this.removeFromWorld = false
        this.#tile_w = this.getJson()["tilewidth"]
        this.#tile_h = this.getJson()["tileheight"]
        this.setSize(this.#tile_w, this.#tile_h)
        this.setBlockX(blockX)
        this.setBlockY(blockY)
    }

    getSpriteSheet() {
        if (this.#sprite_sheet == null) {
            this.#sprite_sheet = ASSET_MANAGER.getImage(this.getSubType() ? `./images/${this.getCategory()}/${this.getType()}/${this.getSubType()}.png` : `./images/${this.#category}/${this.#type}.png`)
        }
        return this.#sprite_sheet
    }

    getJson() {
        if (this.#json == null) {
            this.#json = ASSET_MANAGER.getJson(this.getSubType() ? `./images/${this.#category}/${this.#type}/${this.#type}.json` : `./images/${this.#category}/${this.#type}.json`)
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