class ChestUI extends InventoryUI {

    #chestContainer
    #currentChestPage = 0
    #chestRef

    constructor(characterRef, chestRef = new Chest(10, 10, GAME_ENGINE.getCurrentLevel())) {
        super(characterRef, "./ui/chest.json")
        this.BLOCK_X_OFFSET = -4
        this.ROWS_PER_PAGE = 3
        this.#chestRef = chestRef
        this.#chestContainer = new GameObjectsMapContainer(this.#chestRef.getInventory())
    }

    moveStuffBetweenContainers(currentIndex, key) {
        if (currentIndex >= 0) {
            Level.PLAYER.putItemIntoTargetInventory(key, this.#chestRef)
        } else {
            Level.PLAYER.takeItemOutOfTargetInventory(key, this.#chestRef)
        }
    }

    draw(ctx) {
        super.draw(ctx)
        // padding of the container
        const padding = this.getPadding()
        // get keys
        const inventoryKeys = this.#chestContainer.keys()
        // draw inventory background image
        this.getBackpackTiledStaticImage().setPixelBottom(this.getBackpackTiledStaticImage().getPixelY())
        // calculate the maximum total numbers of items that can be displayed per page
        const ITEM_PER_PAGE = ItemBarUI.ITEMS_PER_ROW * this.ROWS_PER_PAGE
        // calculate the maximum numbers of pages that is needed
        const MAX_NUM_OF_PAGES = Math.ceil(this.#chestContainer.getNumOfItems() / ITEM_PER_PAGE)
        // if more than one page
        if (MAX_NUM_OF_PAGES > 1) {
            this.getBackpackTiledStaticImage().draw(ctx)
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                if (this.getBackpackTiledStaticImage().isTilesHovered(47, 48, 14, 15)) {
                    this.#currentChestPage = Math.max(this.#currentChestPage - 1, 0)
                } else if (this.getBackpackTiledStaticImage().isTilesHovered(47, 48, 18, 19)) {
                    this.#currentChestPage += 1
                }
            }
        } else {
            this.getBackpackTiledStaticImage().drawTiles(ctx, null, null, null, null, 2)
        }
        this.#currentChestPage = Math.min(this.#currentChestPage, MAX_NUM_OF_PAGES)
        // draw out all the item(s) in player's inventory
        for (let i = this.#currentChestPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            // calculate pixel x of the box
            const _pixelX = Math.floor(this.getPixelX() + (i % ItemBarUI.ITEMS_PER_ROW) * 5 * this.getBackpackTiledStaticImage().getTileWidth() + padding)
            // calculate pixel y of the box
            const _pixelY = Math.floor(this.getBackpackTiledStaticImage().getPixelY() + padding + 5 * this.getBackpackTiledStaticImage().getTileHeight() * (Math.floor(i / ItemBarUI.ITEMS_PER_ROW) % this.ROWS_PER_PAGE))
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i]
                this.drawItem(ctx, key, this.#chestContainer.get(key), -1 - i, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            } else {
                this.drawItem(ctx, null, null, -1 - i, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            }
        }
        GAME_ENGINE.ctx.drawImage(
            ASSET_MANAGER.getImageByPath("./images/items/spring_and_summer_objects.png"),
            160, 176, 16, 16,
            this.getBackpackTiledStaticImage().getPixelX() + this.getBackpackTiledStaticImage().getTileWidth() * 1.05, this.getBackpackTiledStaticImage().getPixelY() + this.getBackpackTiledStaticImage().getTileHeight() * 6.75,
            this.getBackpackTiledStaticImage().getTileWidth() * 3, this.getBackpackTiledStaticImage().getTileHeight() * 3
        )
        GAME_ENGINE.ctx.drawImage(
            ASSET_MANAGER.getImageByPath("./images/portrait_cow_kigurumi.png"),
            this.getBackpackTiledStaticImage().getPixelX() + this.getBackpackTiledStaticImage().getTileWidth() * 1.1, this.getBackpackTiledStaticImage().getPixelY() + this.getBackpackTiledStaticImage().getTileHeight() * 24.25,
            this.getBackpackTiledStaticImage().getTileWidth() * 2.5, this.getBackpackTiledStaticImage().getTileHeight() * 2.5
        )
        const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2
        if (MessageButton.draw(GAME_ENGINE.ctx, "Close", _fontSize, GAME_ENGINE.ctx.canvas.width * 0.85, GAME_ENGINE.ctx.canvas.height * 0.7)) {
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                GAME_ENGINE.getPlayerUi().closeChest()
            }
        }
    }
}