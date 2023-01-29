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
    #mapRef = null

    constructor(category, type, subType, blockX, blockY, mapRef) {
        super(0, 0, 0, 0)
        this.#category = category
        this.#type = type
        this.#subType = subType
        this.removeFromWorld = false
        this.#tile_w = this.getJson()["tilewidth"]
        this.#tile_h = this.getJson()["tileheight"]
        this.#uid = ++Entity.#uid_counter
        this.#mapRef = mapRef
        console.assert(this.#mapRef != null)
        this.setSize(this.#tile_w, this.#tile_h)
        this.setBlockX(blockX)
        this.setBlockY(blockY)
    }

    getUid() {
        return this.#uid
    }

    getMapReference() {
        return this.#mapRef
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
        return (this.getPixelX() + this.getWidth() / 2) / this.getMapReference().getTileSize()
    }

    getBlockY() {
        return this.getPixelBottom() / this.getMapReference().getTileSize()
    }

    setBlockX(value) {
        this.setPixelRight(value * this.getMapReference().getTileSize() + this.getWidth() / 2)
    }

    setBlockY(value) {
        this.setPixelBottom(value * this.getMapReference().getTileSize())
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