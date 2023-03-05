class TradeUI extends ItemBarUI {
    static INVENTORY_ITEMS_PER_ROW = 5
    static ROWS_PER_PAGE = 7
    #tradeTiledStaticImage = null
    #currentThisInventoryPage = 0
    #currentTargetInventoryPage = 0
    #fromInventoryContainer
    #toInventoryContainer
    #fromCharacterRef
    #toCharacterRef


    constructor(fromCharacterRef, toCharacterRef) {
        super(fromCharacterRef)
        this.#fromCharacterRef = fromCharacterRef
        this.#toCharacterRef = toCharacterRef
        this.#fromInventoryContainer = new GameObjectsMapContainer(fromCharacterRef.getInventory())
        this.#toInventoryContainer = new GameObjectsMapContainer(toCharacterRef.getInventory())
        this.BLOCK_X_OFFSET = 0
        if (this.#tradeTiledStaticImage == null) this.#tradeTiledStaticImage = new TiledStaticImage("./ui/trade.json")
        this.isOpening = true
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
        if (currentIndex >= 0) {
            if (PRICES[key] != null) {
                if (currentIndex < ItemBarUI.ITEMS_PER_ROW) {
                    const numOfItem = Controller.keys["AltLeft"] ? this.#fromCharacterRef.getItemBar()[key]["amount"] : 1
                    const moneyRequired = numOfItem * PRICES[key]
                    if (this.#toCharacterRef.getMoney() >= moneyRequired) {
                        this.#fromCharacterRef.earnMoney(moneyRequired)
                        this.#toCharacterRef.earnMoney(-moneyRequired)
                        this.#fromCharacterRef.putItemFromItemBarIntoTargetInventory(key, this.#toCharacterRef, numOfItem)
                    }
                } else {
                    const numOfItem = Controller.keys["AltLeft"] ? this.#fromCharacterRef.getInventory()[key]["amount"] : 1
                    const moneyRequired = numOfItem * PRICES[key]
                    if (this.#toCharacterRef.getMoney() >= moneyRequired) {
                        this.#fromCharacterRef.earnMoney(moneyRequired)
                        this.#toCharacterRef.earnMoney(-moneyRequired)
                        this.#fromCharacterRef.putItemFromInventoryIntoTargetInventory(key, this.#toCharacterRef, numOfItem)
                    }
                }
            }
        } else {
            if (PRICES[key] != null) {
                const numOfItem = Controller.keys["AltLeft"] ? this.#toCharacterRef.getInventory()[key]["amount"] : 1
                const moneyRequired = numOfItem * PRICES[key]
                if (this.#fromCharacterRef.getMoney() >= moneyRequired) {
                    this.#fromCharacterRef.earnMoney(-moneyRequired)
                    this.#toCharacterRef.earnMoney(moneyRequired)
                    this.#fromCharacterRef.takeItemOutOfTargetInventory(key, this.#toCharacterRef, numOfItem)
                }
            }
        }
    }

    noContainerIsHovering() {
        return false
    }

    closeUI() {
        this.isOpening = false
    }

    draw(ctx) {
        super.draw(ctx)
        // draw inventory background image
        this.#tradeTiledStaticImage.setTileWidth(ItemBarUI.getItemsBarTiledStaticImage().getTileWidth())
        this.#tradeTiledStaticImage.setTileHeight(ItemBarUI.getItemsBarTiledStaticImage().getTileHeight())
        this.#tradeTiledStaticImage.setPixelX(Math.floor((ctx.canvas.width - this.#tradeTiledStaticImage.getWidth()) / 2))
        this.#tradeTiledStaticImage.setPixelY(Math.ceil(ctx.canvas.height / 10))
        // padding of the container
        const padding = this.getPadding()
        // calculate the maximum total numbers of items that can be displayed per page
        const ITEM_PER_PAGE = TradeUI.INVENTORY_ITEMS_PER_ROW * TradeUI.ROWS_PER_PAGE

        this.#tradeTiledStaticImage.draw(ctx)

        /* render self inventory */

        // get keys
        let inventoryKeys = this.#fromInventoryContainer.keys()
        // calculate the maximum numbers of pages that is needed
        let MAX_NUM_OF_PAGES = Math.ceil(this.#fromInventoryContainer.getNumOfItems() / ITEM_PER_PAGE)
        // if more than one page
        if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
            if (this.#tradeTiledStaticImage.isTilesHovered(28, 29, 20, 21)) {
                this.#currentThisInventoryPage = Math.max(this.#currentThisInventoryPage - 1, 0)
            } else if (this.#tradeTiledStaticImage.isTilesHovered(28, 29, 22, 23)) {
                this.#currentThisInventoryPage += 1
            }
        }
        this.#currentThisInventoryPage = Math.min(this.#currentThisInventoryPage, MAX_NUM_OF_PAGES)
        // draw out all the item(s) in player's inventory
        for (let i = this.#currentThisInventoryPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            // calculate pixel x of the box
            const _pixelX = Math.floor(this.#tradeTiledStaticImage.getPixelX() + (i % TradeUI.INVENTORY_ITEMS_PER_ROW) * 5 * this.#tradeTiledStaticImage.getTileWidth() + padding)
            // calculate pixel y of the box
            const _pixelY = Math.floor(this.#tradeTiledStaticImage.getPixelY() + padding * 2.75 + 5 * this.#tradeTiledStaticImage.getTileHeight() * (Math.floor(i / TradeUI.INVENTORY_ITEMS_PER_ROW) % TradeUI.ROWS_PER_PAGE))
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i]
                this.drawItem(ctx, key, this.#fromInventoryContainer.get(key), i + ItemBarUI.ITEMS_PER_ROW, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            } else {
                this.drawItem(ctx, null, null, i + ItemBarUI.ITEMS_PER_ROW, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            }
        }

        /* render target inventory */

        // get keys
        inventoryKeys = this.#toInventoryContainer.keys()
        // calculate the maximum numbers of pages that is needed
        MAX_NUM_OF_PAGES = Math.ceil(this.#toInventoryContainer.getNumOfItems() / ITEM_PER_PAGE)
        // if more than one page
        if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
            if (this.#tradeTiledStaticImage.isTilesHovered(29, 30, 20, 21)) {
                this.#currentTargetInventoryPage = Math.max(this.#currentTargetInventoryPage - 1, 0)
            } else if (this.#tradeTiledStaticImage.isTilesHovered(29, 30, 22, 23)) {
                this.#currentTargetInventoryPage += 1
            }
        }
        this.#currentTargetInventoryPage = Math.min(this.#currentTargetInventoryPage, MAX_NUM_OF_PAGES)
        // draw out all the item(s) in player's inventory
        for (let i = this.#currentTargetInventoryPage * ITEM_PER_PAGE, n = i + ITEM_PER_PAGE; i < n; i++) {
            // calculate pixel x of the box
            const _pixelX = Math.floor(this.#tradeTiledStaticImage.getPixelX() + this.#tradeTiledStaticImage.getTileWidth() * 29 + (i % TradeUI.INVENTORY_ITEMS_PER_ROW) * 5 * this.#tradeTiledStaticImage.getTileWidth() + padding)
            // calculate pixel y of the box
            const _pixelY = Math.floor(this.#tradeTiledStaticImage.getPixelY() + padding * 2.75 + 5 * this.#tradeTiledStaticImage.getTileHeight() * (Math.floor(i / TradeUI.INVENTORY_ITEMS_PER_ROW) % TradeUI.ROWS_PER_PAGE))
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i]
                this.drawItem(ctx, key, this.#toInventoryContainer.get(key), -(i + ItemBarUI.ITEMS_PER_ROW), _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            } else {
                this.drawItem(ctx, null, null, -(i + ItemBarUI.ITEMS_PER_ROW), _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            }
        }

        let _fontSize = Math.floor(Level.PLAYER.getMapReference().getTileSize() / 2)
        if (MessageButton.draw(GAME_ENGINE.ctx, "Done", _fontSize, GAME_ENGINE.ctx.canvas.width * 0.85, GAME_ENGINE.ctx.canvas.height * 0.85)) {
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                this.closeUI()
            }
        }
        _fontSize = Math.floor(_fontSize * 0.75)
        Font.update(GAME_ENGINE.ctx, _fontSize, "black", "black", Font.DEFAULT_TYPE, "")
        Font.render(GAME_ENGINE.ctx, this.#fromCharacterRef.getMoney(), GAME_ENGINE.ctx.canvas.width * 0.265 - Font.measure(GAME_ENGINE.ctx, this.#fromCharacterRef.getMoney()).width, GAME_ENGINE.ctx.canvas.height * 0.155)
        Font.render(GAME_ENGINE.ctx, this.#toCharacterRef.getMoney(), GAME_ENGINE.ctx.canvas.width * 0.735, GAME_ENGINE.ctx.canvas.height * 0.155)
        this.#fromCharacterRef.getCurrentAnimation().drawFrame(
            GAME_ENGINE.clockTick, ctx,
            this.#tradeTiledStaticImage.getTileWidth() * 7.25, this.#tradeTiledStaticImage.getTileHeight() * 6.5,
            this.#tradeTiledStaticImage.getTileWidth() * 2, this.#tradeTiledStaticImage.getTileHeight() * 2
        )
        this.#toCharacterRef.getCurrentAnimation().drawFrame(
            GAME_ENGINE.clockTick, ctx,
            this.#tradeTiledStaticImage.getTileWidth() * 59.25, this.#tradeTiledStaticImage.getTileHeight() * 6.5,
            this.#tradeTiledStaticImage.getTileWidth() * 2, this.#tradeTiledStaticImage.getTileHeight() * 2
        )
    }
}