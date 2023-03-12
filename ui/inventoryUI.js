class InventoryUI extends ItemBarUI {
    #backpackTiledStaticImage = null
    ROWS_PER_PAGE = 6
    #currentInventoryPage = 0
    #inventoryContainer


    constructor(characterRef, backpackTiledStaticImagePath = null) {
        super(characterRef)
        this.#inventoryContainer = new GameObjectsMapContainer(characterRef.getInventory())
        this.BLOCK_X_OFFSET = 0
        if (this.#backpackTiledStaticImage == null) this.#backpackTiledStaticImage = new TiledStaticImage(backpackTiledStaticImagePath == null ? "./ui/backpack.json" : backpackTiledStaticImagePath)
        this.isOpening = false
    }

    caseItemBeingHovered(currentIndex, key) {
        if (super.caseItemBeingHovered(currentIndex, key)) {
            return true
        } else if (key != null && !Controller.mouse_prev.rightClick && Controller.mouse.rightClick) {
            this.moveStuffBetweenContainers(currentIndex, key)
            return true
        }
        return false
    }

    moveStuffBetweenContainers(currentIndex, key) {
        if (currentIndex < ItemBarUI.ITEMS_PER_ROW) {
            Level.PLAYER.putItemIntoInventory(key, Controller.keys["AltLeft"] ? null : 1)
        } else if (this.getNumOfItems() < ItemBarUI.ITEMS_PER_ROW) {
            Level.PLAYER.takeItemOutOfInventory(key, Controller.keys["AltLeft"] ? null : 1)
        }
    }

    getBackpackTiledStaticImage() {
        return this.#backpackTiledStaticImage
    }

    noContainerIsHovering() {
        return false
    }

    closeUI() {
        this.isOpening = false
    }


    drawInventory(ctx) {
        this.drawItemBar(ctx)
        // padding of the container
        const padding = this.getPadding()
        // get keys
        const inventoryKeys = this.#inventoryContainer.keys()
        // draw inventory background image
        this.#backpackTiledStaticImage.setTileWidth(ItemBarUI.getItemsBarTiledStaticImage().getTileWidth())
        this.#backpackTiledStaticImage.setTileHeight(ItemBarUI.getItemsBarTiledStaticImage().getTileHeight())
        this.#backpackTiledStaticImage.setPixelX(this.getPixelX() + ItemBarUI.getItemsBarTiledStaticImage().getTileWidth() * this.BLOCK_X_OFFSET)
        this.#backpackTiledStaticImage.setPixelBottom(ItemBarUI.getItemsBarTiledStaticImage().getPixelY() - padding * 2)
        // calculate the maximum total numbers of items that can be displayed per page
        const ITEM_PER_PAGE = ItemBarUI.ITEMS_PER_ROW * this.ROWS_PER_PAGE
        // calculate the maximum numbers of pages that is needed
        const MAX_NUM_OF_PAGES = Math.ceil(this.#inventoryContainer.getNumOfItems() / ITEM_PER_PAGE)
        // if more than one page
        if (MAX_NUM_OF_PAGES > 1) {
            this.#backpackTiledStaticImage.draw(ctx)
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                if (this.#backpackTiledStaticImage.isTilesHovered(47, 48, 14, 15)) {
                    this.#currentInventoryPage = Math.max(this.#currentInventoryPage - 1, 0)
                } else if (this.#backpackTiledStaticImage.isTilesHovered(47, 48, 18, 19)) {
                    this.#currentInventoryPage += 1
                }
            }
        } else {
            this.#backpackTiledStaticImage.drawTiles(ctx, null, null, null, null, 2)
        }
        this.#currentInventoryPage = Math.min(this.#currentInventoryPage, MAX_NUM_OF_PAGES)
        // draw out all the item(s) in player's inventory
        for (let i = this.#currentInventoryPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            // calculate pixel x of the box
            const _pixelX = Math.floor(this.getPixelX() + (i % ItemBarUI.ITEMS_PER_ROW) * 5 * this.#backpackTiledStaticImage.getTileWidth() + padding)
            // calculate pixel y of the box
            const _pixelY = Math.floor(this.#backpackTiledStaticImage.getPixelY() + padding + 5 * this.#backpackTiledStaticImage.getTileHeight() * (Math.floor(i / ItemBarUI.ITEMS_PER_ROW) % this.ROWS_PER_PAGE))
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i]
                this.drawItem(ctx, key, this.#inventoryContainer.get(key), i + ItemBarUI.ITEMS_PER_ROW, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            } else {
                this.drawItem(ctx, null, null, i + ItemBarUI.ITEMS_PER_ROW, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            }
        }
        const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2
        if (MessageButton.draw(GAME_ENGINE.ctx, "Close", _fontSize, GAME_ENGINE.ctx.canvas.width * 0.85, GAME_ENGINE.ctx.canvas.height * 0.7)) {
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                this.closeUI()
            }
        }
    }

    draw(ctx) {
        this.drawInventory(ctx)
        this.drawInfo(ctx)
    }
}