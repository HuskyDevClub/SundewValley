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
        this.customHitBox = null
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

    setMapReference(_ref) {
        return this.#mapRef = _ref
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

    getPixelHitBox() {
        if (this.customHitBox != null) {
            return {
                x: this.getPixelX() + this.customHitBox.x * this.getMapReference().getTileSize(),
                y: this.getPixelY() + this.customHitBox.y * this.getMapReference().getTileSize(),
                width: this.customHitBox.width * this.getMapReference().getTileSize(),
                height: this.customHitBox.height * this.getMapReference().getTileSize()
            };
        } else {
            return {
                x: this.getPixelX(),
                y: this.getPixelY(),
                width: this.getWidth(),
                height: this.getHeight()
            };
        }
    }

    collideWith(o) {
        const thisPixelHitBox = this.getPixelHitBox();
        const thatPixelHitBox = o.getPixelHitBox();
        return Math.max(thisPixelHitBox.x, thatPixelHitBox.x) <= Math.min(thisPixelHitBox.x + thisPixelHitBox.width, thatPixelHitBox.x + thatPixelHitBox.width)
            && Math.max(thisPixelHitBox.y, thatPixelHitBox.y) <= Math.min(thisPixelHitBox.y + thisPixelHitBox.height, thatPixelHitBox.y + thatPixelHitBox.height)
    }
}