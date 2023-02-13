class GUI {

    static #SPRITE_SHEET = null
    static #PIXEL_SIZE = null

    static init() {
        if (this.#SPRITE_SHEET == null) {
            this.#SPRITE_SHEET = ASSET_MANAGER.getImageByPath("./images/ui/gui.png")
            this.#PIXEL_SIZE = ASSET_MANAGER.getJsonByPath("./images/ui/gui.json")["tilewidth"]
        }
    }

    static draw(ctx, frameX, frameY, frameWidth, frameHeight, dx, dy, dw, dh) {
        ctx.drawImage(this.#SPRITE_SHEET, frameX * this.#PIXEL_SIZE, frameY * this.#PIXEL_SIZE, frameWidth * this.#PIXEL_SIZE, frameHeight * this.#PIXEL_SIZE, dx, dy, dw, dh)
    }
}