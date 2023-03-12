class ItemBarUI extends GameObjectsMapContainer {
    static #itemsBarTiledStaticImage = null
    static ITEMS_PER_ROW = 9
    #boxSize
    #selected
    #latestHovered

    constructor(characterRef) {
        super(characterRef.getItemBar())
        this.#boxSize = Math.floor(GAME_ENGINE.ctx.canvas.width / 20)
        this.#selected = -1
        this.#latestHovered = null
        if (ItemBarUI.#itemsBarTiledStaticImage == null) ItemBarUI.#itemsBarTiledStaticImage = new TiledStaticImage("./ui/itemsBar.json")
    }

    static getItemsBarTiledStaticImage() {
        return this.#itemsBarTiledStaticImage
    }

    noContainerIsHovering() {
        return !ItemBarUI.#itemsBarTiledStaticImage.isHovering()
    }

    getPadding() {
        return Math.floor(this.#boxSize / 2)
    }

    getBoxSize() {
        return this.#boxSize
    }

    drawTool(ctx, key, pixelX, pixelY, width, height, toolLevel = 0) {
        const boxWidth = this.#boxSize * 1.75
        const boxHeight = this.#boxSize * 1.75
        const boxStartX = pixelX + (width - boxWidth) / 2
        const boxStartY = pixelY + (height - boxHeight) / 2
        GUI.draw(ctx, 9, 0, 3, 3, boxStartX, boxStartY, boxWidth, boxHeight)
        InventoryItems.drawImage(ctx, key, pixelX, pixelY, width, height, toolLevel)
    }

    //draw all the tools
    drawTools(ctx) {
        const size = Math.floor(this.#boxSize * 2 / 3)
        this.drawTool(ctx, "pot", size, size, size, size, 1)
        this.drawTool(ctx, "axe", size + this.#boxSize * 3 / 2, size, size, size, 1)
        this.drawTool(ctx, "hoe", size + this.#boxSize * 3, size, size, size, 1)
    }

    caseItemBeingHovered(currentIndex, key) {
        // if player left-click this item
        if (Controller.mouse.leftClick) {
            // the item will be selected
            this.#selected = currentIndex
            return true
        }
        return false;
    }

    drawItem(ctx, key, value, index, pixelX, pixelY, width, height) {
        // draw item icon
        if (key != null) InventoryItems.drawImage(ctx, key, pixelX, pixelY, width, height)
        // if current item has been selected
        if (this.#selected === index) {
            GUI.draw(ctx, 15, 0, 2, 2, pixelX - this.#boxSize * 0.35, pixelY - this.#boxSize * 0.35, this.#boxSize * 1.75, this.#boxSize * 1.75)
            // draw item icon on mouse location
            if (key != null && InventoryItems.isUsable(key) && this.noContainerIsHovering()) {
                if (GAME_ENGINE.getCurrentLevel() instanceof FarmLevel && Level.PLAYER.notDisablePlayerController()) {
                    const onBlock = GAME_ENGINE.getCurrentLevel().getCoordinate(Controller.mouse.x, Controller.mouse.y, GAME_ENGINE.getCurrentLevel().getTileSize())
                    if (onBlock != null) {
                        // if you can plant stuff on this tile
                        if (GAME_ENGINE.getCurrentLevel().canPlantOnTile(onBlock[0], onBlock[1])) {
                            ctx.fillStyle = 'rgba(127,255,0,0.5)';
                            if (Controller.mouse.leftClick && Level.PLAYER.tryUseItem(key)) {
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
        // if box is hovered
        if (pixelX <= Controller.mouse.x && Controller.mouse.x <= pixelX + this.#boxSize && pixelY <= Controller.mouse.y && Controller.mouse.y <= pixelY + this.#boxSize) {
            this.#latestHovered = {key, value}
            this.caseItemBeingHovered(index, key)
        }
        // render item number text
        if (value != null && value.amount > 1) {
            Font.update(ctx, Math.ceil(ItemBarUI.#itemsBarTiledStaticImage.getTileHeight() * 1.75))
            Font.render(ctx, value.amount, pixelX + this.#boxSize - ctx.measureText(value.amount).width, pixelY + this.#boxSize)
        }
    }

    drawInfo(ctx) {
        if (this.#latestHovered != null && this.#latestHovered.value != null) {
            const itemPrice = PRICES[this.#latestHovered.key] != null ? PRICES[this.#latestHovered.key] : 0
            MessageBox.drawLines(ctx, [`amount: ${this.#latestHovered.value.amount}`, `Price: ${itemPrice}`, `Total Value: ${itemPrice * this.#latestHovered.value.amount}`], 30, Controller.mouse.x, Controller.mouse.y, undefined, undefined, undefined, 0.5)
        }
    }

    drawItemBar(ctx) {
        super.draw(ctx)
        this.drawTools(ctx)
        // get keys
        const itemBarKeys = this.keys()
        // padding of the container
        const padding = this.getPadding()
        // update size
        this.setWidth((this.#boxSize + padding) * ItemBarUI.ITEMS_PER_ROW + padding)
        this.setHeight(this.#boxSize + padding * 2)
        // update position
        this.setPixelY(ctx.canvas.height - padding - this.getHeight())
        this.setPixelX((ctx.canvas.width - this.getWidth()) / 2)
        // draw item bar background image
        ItemBarUI.#itemsBarTiledStaticImage.setPixelX(this.getPixelX())
        ItemBarUI.#itemsBarTiledStaticImage.setPixelY(this.getPixelY())
        ItemBarUI.#itemsBarTiledStaticImage.setWidth(this.getWidth())
        ItemBarUI.#itemsBarTiledStaticImage.setHeight(this.getHeight())
        ItemBarUI.#itemsBarTiledStaticImage.draw(ctx)
        // calculate pixel y of the box
        const _pixelY = Math.floor(this.getPixelY() + padding)
        this.#latestHovered = null
        // draw out all the item(s) in player quick access item bar
        for (let i = 0; i < ItemBarUI.ITEMS_PER_ROW; i++) {
            // calculate pixel x of the box
            const _pixelX = Math.floor(this.getPixelX() + i * 5 * ItemBarUI.#itemsBarTiledStaticImage.getTileWidth() + padding)
            if (i < itemBarKeys.length) {
                const key = itemBarKeys[i]
                this.drawItem(ctx, key, this.get(key), i, _pixelX, _pixelY, this.#boxSize, this.#boxSize)
            } else {
                this.drawItem(ctx, null, null, i, _pixelX, _pixelY, this.#boxSize, this.#boxSize)
            }
        }
        // press Escape to deselect item
        if (Controller.keys["Escape"]) {
            this.#selected = -1
        }
    }

    draw(ctx) {
        this.drawItemBar(ctx)
        this.drawInfo(ctx)
    }
}