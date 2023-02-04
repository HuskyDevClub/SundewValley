class Inventory extends GameObjectsMapContainer {
    static #BASE_SPRITE_SHEET = null
    #boxSize
    #selected = -1
    #itemsBar = ASSET_MANAGER.getImageByPath("./images/ui/itemsBar.png")

    constructor(characterRef) {
        super(characterRef.getInventory())
        this.#boxSize = Math.floor(GAME_ENGINE.ctx.canvas.width / 20)
        if (Inventory.#BASE_SPRITE_SHEET == null) Inventory.#BASE_SPRITE_SHEET = ASSET_MANAGER.getImageByPath("./images/ui/gui.png")
    }

    drawItem(ctx, key, pixelX, pixelY, width, height, isSelected) {
        const boxStartX = pixelX - width / 2
        const boxStartY = pixelY - height / 2
        const boxWidth = this.#boxSize * 2
        const boxHeight = this.#boxSize * 2
        // draw the bg
        ctx.drawImage(Inventory.#BASE_SPRITE_SHEET, 0, InventoryItems.getPixelSize() * 6, InventoryItems.getPixelSize() * 3, InventoryItems.getPixelSize() * 3, boxStartX, boxStartY, boxWidth, boxWidth)
        // draw item icon
        InventoryItems.drawImage(ctx, key, pixelX, pixelY, width, height)
        if (isSelected) {
            ctx.drawImage(Inventory.#BASE_SPRITE_SHEET, 15 * InventoryItems.getPixelSize(), 0, InventoryItems.getPixelSize() * 2, InventoryItems.getPixelSize() * 2, boxStartX, boxStartY, boxWidth, boxWidth)
            // draw item icon on mouse location
            if (InventoryItems.isUsable(key)) {
                if (GAME_ENGINE.getCurrentLevel() instanceof FarmLevel) {
                    const onBlock = GAME_ENGINE.getCurrentLevel().getCoordinate(Controller.mouse.x, Controller.mouse.y, GAME_ENGINE.getCurrentLevel().getTileSize())
                    if (onBlock != null) {
                        if (GAME_ENGINE.getCurrentLevel().canPlantOnTile(onBlock[0], onBlock[1])) {
                            ctx.fillStyle = 'rgba(127,255,0,0.5)';
                        } else {
                            ctx.fillStyle = 'rgba(255,0,0,0.5)';
                        }
                        ctx.fillRect(
                            GAME_ENGINE.getCurrentLevel().getTileSize() * onBlock[0] + GAME_ENGINE.getCurrentLevel().getPixelX(),
                            GAME_ENGINE.getCurrentLevel().getTileSize() * onBlock[1] + GAME_ENGINE.getCurrentLevel().getPixelY(),
                            GAME_ENGINE.getCurrentLevel().getTileSize(), GAME_ENGINE.getCurrentLevel().getTileSize()
                        );
                        ctx.globalAlpha = 1;
                    }
                }
                InventoryItems.drawImage(ctx, key, Controller.mouse.x, Controller.mouse.y, width / 2, height / 2)
            }
        }
        return boxStartX < Controller.mouse.x && Controller.mouse.x < boxStartX + boxWidth && boxStartY < Controller.mouse.y && Controller.mouse.y < boxStartY + boxHeight
    }

    draw(ctx) {
        super.draw(ctx)
        const _keys = this.keys()
        const _pixelY = ctx.canvas.height * 0.9
        const totalWidth = this.#boxSize * 1.575 * _keys.length
        let _pixelX = (ctx.canvas.width - totalWidth) / 2
        ctx.drawImage(this.#itemsBar, _pixelX, _pixelY - this.#boxSize / 2, totalWidth, this.#boxSize * 2)
        _pixelX += this.#boxSize / 2
        for (let i = 0; i < _keys.length; i++) {
            const key = _keys[i]
            const value = this.get(key)
            if (this.drawItem(ctx, key, _pixelX, _pixelY, this.#boxSize, this.#boxSize, this.#selected === i) && Controller.mouse.leftClick) {
                this.#selected = i
            }
            if (value > 1) {
                ctx.font = `bold ${this.#boxSize / 3}px arial`
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.fillText(value, _pixelX + this.#boxSize * 0.8, _pixelY + this.#boxSize * 0.95)
                ctx.strokeText(value, _pixelX + this.#boxSize * 0.8, _pixelY + this.#boxSize * 0.95)
            }
            _pixelX += this.#boxSize * 1.5
        }
        if (Controller.keys["Escape"]) {
            this.#selected = -1
        }
    }
}