class TileAssetsManager {

    #sprites = {}
    #sprites_data = {}

    constructor() {
    }

    isEmpty() {
        return Object.keys(this.#sprites).length <= 0
    }

    setSprite(name, image, data) {
        this.#sprites[name] = image
        this.#sprites_data[name] = data
    }

    drawSprite(ctx, spriteName, tileName, x, y, width, height) {
        let _rect = this.#sprites_data[spriteName][tileName]
        ctx.drawImage(this.#sprites[spriteName], _rect[0], _rect[1], _rect[2], _rect[3], x, y, width, height);
    }
}