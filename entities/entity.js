class Entity {
    #type
    #sprite_sheet
    #x
    #y
    #w
    #h
    #moving_speed
    #animations
    #current_action
    #direction_facing = "r"
    removeFromWorld = false

    constructor(type, x, y) {
        this.#type = type
        this.#sprite_sheet = ASSET_MANAGER.getAsset(`./images/characters/${this.#type}.png`)
        this.#x = x
        this.#y = y
        this.#w = 0
        this.#h = 0
        this.#moving_speed = 1
        this.#animations = {}
        this.setCurrentAction("idle")
        let data = JSON_MANAGER.getJson(`./images/characters/${this.#type}.json`)
        this.setSize(data["size"][0], data["size"][1])
        for (const [key, value] of Object.entries(data["animations"])) {
            this.setAnimation(key, value[0] * this.#w, value[1] * this.#h, value[2], 1 / value[2], true);
        }
    }

    getType() {
        return this.#type
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

    getMovingSpeed() {
        return this.#moving_speed
    }

    setMovingSpeed(speed) {
        this.#moving_speed = speed
    }

    setAnimation(name, xStart, yStart, frameCount, frameDuration, loop) {
        this.#animations[name] = new Animator(this.#sprite_sheet, xStart, yStart, this.getWidth(), this.getHeight(), frameCount, frameDuration, 0, false, loop)
    }

    getAnimation(name) {
        return this.#animations[name];
    }

    getCurrentAnimation() {
        return this.getAnimation(this.getCurrentAction());
    }

    getCurrentAction() {
        return this.#current_action;
    }

    setCurrentAction(action, widthDirectionFacing) {
        if (widthDirectionFacing === undefined || widthDirectionFacing === true) {
            this.#current_action = action + "_" + this.getDirectionFacing();
        } else {
            this.#current_action = action;
        }
    }

    getDirectionFacing() {
        return this.#direction_facing;
    }

    setDirectionFacing(dirt) {
        this.#direction_facing = dirt;
    }

    draw(ctx) {
        this.getCurrentAnimation().drawFrame(gameEngine.clockTick, ctx, this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight())
    };
}