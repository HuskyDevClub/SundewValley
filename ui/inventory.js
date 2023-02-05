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
            if (InventoryItems.isUsable(key) && !this.isHovering()) {
                if (GAME_ENGINE.getCurrentLevel() instanceof FarmLevel) {
                    const onBlock = GAME_ENGINE.getCurrentLevel().getCoordinate(Controller.mouse.x, Controller.mouse.y, GAME_ENGINE.getCurrentLevel().getTileSize())
                    if (onBlock != null) {
                        // if you can plant stuff on this tile
                        if (GAME_ENGINE.getCurrentLevel().canPlantOnTile(onBlock[0], onBlock[1])) {
                            ctx.fillStyle = 'rgba(127,255,0,0.5)';
                            if (Controller.mouse.leftClick && GAME_ENGINE.getCurrentLevel().getPlayer().tryUseItem(key)) {
                                GAME_ENGINE.getCurrentLevel().addEntity(new Crop(key.replace('_seed', ''), onBlock[0], onBlock[1], GAME_ENGINE.getCurrentLevel()))
                            }
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
        // get keys
        const _keys = this.keys()
        // padding of the container
        const _padding = this.#boxSize / 2
        // update size
        this.setWidth((this.#boxSize + _padding) * _keys.length + _padding)
        this.setHeight(this.#boxSize * 2)
        // update position
        this.setPixelY(ctx.canvas.height - _padding - this.getHeight())
        this.setPixelX((ctx.canvas.width - this.getWidth()) / 2)
        // draw item bar background image
        ctx.drawImage(this.#itemsBar, this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight())
        // the start pixel x of the first box
        let _pixelX = this.getPixelX() + _padding
        let _pixelY = this.getPixelY() + _padding
        // draw out all the item(s)
        for (let i = 0; i < _keys.length; i++) {
            const key = _keys[i]
            const value = this.get(key)
            if (this.drawItem(ctx, key, _pixelX, _pixelY, this.#boxSize, this.#boxSize, this.#selected === i) && Controller.mouse.leftClick) {
                this.#selected = i
            }
            if (value > 1) {
                ctx.font = `bold ${_padding}px arial`
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.fillText(value, _pixelX + this.#boxSize * 3 / 4, _pixelY + this.#boxSize)
                ctx.strokeText(value, _pixelX + this.#boxSize * 3 / 4, _pixelY + this.#boxSize)
            }
            _pixelX += this.#boxSize + _padding
        }
        // press Escape to deselect item
        if (Controller.keys["Escape"]) {
            this.#selected = -1
        }
    }
}