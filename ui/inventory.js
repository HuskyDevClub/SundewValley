class Inventory extends GameObjectsMapContainer {
    static #BASE_SPRITE_SHEET = null
    static #itemsBarTiledStaticImage = null
    static #backpackTiledStaticImage = null
    static ITEMS_PER_ROW = 9
    #boxSize
    #selected = -1
    #inventoryContainer

    constructor(characterRef) {
        super(characterRef.getItemBar())
        this.#boxSize = Math.floor(GAME_ENGINE.ctx.canvas.width / 20)
        this.#inventoryContainer = new GameObjectsMapContainer(characterRef.getInventory())
        this.isInventoryUIVisible = false
        if (Inventory.#BASE_SPRITE_SHEET == null) Inventory.#BASE_SPRITE_SHEET = ASSET_MANAGER.getImageByPath("./images/ui/gui.png")
        if (Inventory.#itemsBarTiledStaticImage == null) Inventory.#itemsBarTiledStaticImage = new TiledStaticImage("./ui/itemsBar.json")
        if (Inventory.#backpackTiledStaticImage == null) Inventory.#backpackTiledStaticImage = new TiledStaticImage("./ui/backpack.json")
    }

    drawTool(ctx, key, pixelX, pixelY, width, height, toolLevel = 0) {
        const boxWidth = this.#boxSize * 1.75
        const boxHeight = this.#boxSize * 1.75
        const boxStartX = pixelX + (width - boxWidth) / 2
        const boxStartY = pixelY + (height - boxHeight) / 2
        ctx.drawImage(Inventory.#BASE_SPRITE_SHEET, 9 * InventoryItems.getPixelSize(), 0, InventoryItems.getPixelSize() * 3, InventoryItems.getPixelSize() * 3, boxStartX, boxStartY, boxWidth, boxHeight)
        InventoryItems.drawImage(ctx, key, pixelX, pixelY, width, height, toolLevel)
    }

    //draw all the tools
    drawTools(ctx) {
        const size = Math.floor(this.#boxSize * 2 / 3)
        this.drawTool(ctx, "pot", size, size, size, size, 1)
        this.drawTool(ctx, "axe", size + this.#boxSize * 3 / 2, size, size, size, 1)
        this.drawTool(ctx, "hoe", size + this.#boxSize * 3, size, size, size, 1)
    }

    drawItem(ctx, key, value, index, pixelX, pixelY, width, height) {
        // draw item icon
        if (key != null) InventoryItems.drawImage(ctx, key, pixelX, pixelY, width, height)
        // if current item has been selected
        if (this.#selected === index) {
            ctx.drawImage(Inventory.#BASE_SPRITE_SHEET, 15 * InventoryItems.getPixelSize(), 0, InventoryItems.getPixelSize() * 2, InventoryItems.getPixelSize() * 2, pixelX - this.#boxSize * 0.35, pixelY - this.#boxSize * 0.35, this.#boxSize * 1.75, this.#boxSize * 1.75)
            // draw item icon on mouse location
            if (key != null && InventoryItems.isUsable(key) && !Inventory.#itemsBarTiledStaticImage.isHovering() && (!this.isInventoryUIVisible || !Inventory.#backpackTiledStaticImage.isHovering())) {
                if (GAME_ENGINE.getCurrentLevel() instanceof FarmLevel) {
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
        } else if (pixelX <= Controller.mouse.x && Controller.mouse.x <= pixelX + this.#boxSize && pixelY <= Controller.mouse.y && Controller.mouse.y <= pixelY + this.#boxSize) {
            // if player left-click this item
            if (Controller.mouse.leftClick) {
                // the item will be selected
                this.#selected = index
            } else if (key != null && !Controller.mouse_prev.rightClick && Controller.mouse.rightClick && this.isInventoryUIVisible) {
                if (index < Inventory.ITEMS_PER_ROW) {
                    Level.PLAYER.putItemIntoInventory(key)
                } else if (this.getNumOfItems() < Inventory.ITEMS_PER_ROW) {
                    Level.PLAYER.takeItemOutOfInventory(key)
                }
            }
        }
        // render item number text
        if (value != null && value.amount > 1) {
            ctx.font = `bold ${Math.floor(Inventory.#itemsBarTiledStaticImage.getTileHeight() * 1.75)}px arial`
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.fillText(value.amount, pixelX + this.#boxSize - ctx.measureText(value.amount).width, pixelY + this.#boxSize)
            ctx.strokeText(value.amount, pixelX + this.#boxSize - ctx.measureText(value.amount).width, pixelY + this.#boxSize)
        }

    }

    draw(ctx) {
        super.draw(ctx)
        this.drawTools(ctx)
        // get keys
        const itemBarKeys = this.keys()
        // padding of the container
        const padding = Math.floor(this.#boxSize / 2)
        // update size
        this.setWidth((this.#boxSize + padding) * Inventory.ITEMS_PER_ROW + padding)
        this.setHeight(this.#boxSize + padding * 2)
        // update position
        this.setPixelY(ctx.canvas.height - padding - this.getHeight())
        this.setPixelX((ctx.canvas.width - this.getWidth()) / 2)
        // draw item bar background image
        Inventory.#itemsBarTiledStaticImage.setPixelX(this.getPixelX())
        Inventory.#itemsBarTiledStaticImage.setPixelY(this.getPixelY())
        Inventory.#itemsBarTiledStaticImage.setWidth(this.getWidth())
        Inventory.#itemsBarTiledStaticImage.setHeight(this.getHeight())
        Inventory.#itemsBarTiledStaticImage.draw(ctx)
        // calculate pixel y of the box
        let _pixelY = Math.floor(this.getPixelY() + padding)
        let _pixelX = 0
        // draw out all the item(s) in player quick access item bar
        for (let i = 0; i < Inventory.ITEMS_PER_ROW; i++) {
            // calculate pixel x of the box
            _pixelX = Math.floor(this.getPixelX() + i * 5 * Inventory.#itemsBarTiledStaticImage.getTileWidth() + padding)
            if (i < itemBarKeys.length) {
                const key = itemBarKeys[i]
                this.drawItem(ctx, key, this.get(key), i, _pixelX, _pixelY, this.#boxSize, this.#boxSize)
            } else {
                this.drawItem(ctx, null, null, i, _pixelX, _pixelY, this.#boxSize, this.#boxSize)
            }
        }
        if (this.isInventoryUIVisible) {
            // get keys
            const inventoryKeys = this.#inventoryContainer.keys()
            // draw inventory background image
            Inventory.#backpackTiledStaticImage.setTileWidth(Inventory.#itemsBarTiledStaticImage.getTileWidth())
            Inventory.#backpackTiledStaticImage.setTileHeight(Inventory.#itemsBarTiledStaticImage.getTileHeight())
            Inventory.#backpackTiledStaticImage.setPixelX(this.getPixelX())
            Inventory.#backpackTiledStaticImage.setPixelY(Inventory.#itemsBarTiledStaticImage.getPixelY() - padding * 2 - Inventory.#backpackTiledStaticImage.getHeight())
            Inventory.#backpackTiledStaticImage.draw(ctx)
            // draw out all the item(s) in player's inventory
            for (let i = 0; i < Inventory.ITEMS_PER_ROW * 6; i++) {
                // calculate pixel x of the box
                _pixelX = Math.floor(this.getPixelX() + (i % Inventory.ITEMS_PER_ROW) * 5 * Inventory.#backpackTiledStaticImage.getTileWidth() + padding)
                // calculate pixel y of the box
                _pixelY = Math.floor(Inventory.#backpackTiledStaticImage.getPixelY() + padding + 5 * Inventory.#backpackTiledStaticImage.getTileHeight() * Math.floor(i / Inventory.ITEMS_PER_ROW))
                if (i < inventoryKeys.length) {
                    const key = inventoryKeys[i]
                    this.drawItem(ctx, key, this.#inventoryContainer.get(key), i + Inventory.ITEMS_PER_ROW, _pixelX, _pixelY, this.#boxSize, this.#boxSize)
                } else {
                    this.drawItem(ctx, null, null, i + Inventory.ITEMS_PER_ROW, _pixelX, _pixelY, this.#boxSize, this.#boxSize)
                }
            }
        }
        // press Escape to deselect item
        if (Controller.keys["Escape"]) {
            this.#selected = -1
        }
    }
}