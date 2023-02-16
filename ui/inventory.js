class Inventory extends ItemBar {
    #backpackTiledStaticImage = null
    ROWS_PER_PAGE = 6
    #currentInventoryPage = 0
    #inventoryContainer


    constructor(characterRef, backpackTiledStaticImagePath = null) {
        super(characterRef)
        this.#inventoryContainer = new GameObjectsMapContainer(characterRef.getInventory())
        this.BLOCK_X_OFFSET = 0
        if (this.#backpackTiledStaticImage == null) this.#backpackTiledStaticImage = new TiledStaticImage(backpackTiledStaticImagePath == null ? "./ui/backpack.json" : backpackTiledStaticImagePath)
    }

    getBackpackTiledStaticImage() {
        return this.#backpackTiledStaticImage
    }

    noContainerIsHovering() {
        return super.noContainerIsHovering() && !this.#backpackTiledStaticImage.isHovering()
    }

    draw(ctx) {
        super.draw(ctx)
        // padding of the container
        const padding = this.getPadding()
        // get keys
        const inventoryKeys = this.#inventoryContainer.keys()
        // draw inventory background image
        this.#backpackTiledStaticImage.setTileWidth(ItemBar.getItemsBarTiledStaticImage().getTileWidth())
        this.#backpackTiledStaticImage.setTileHeight(ItemBar.getItemsBarTiledStaticImage().getTileHeight())
        this.#backpackTiledStaticImage.setPixelX(this.getPixelX() + ItemBar.getItemsBarTiledStaticImage().getTileWidth() * this.BLOCK_X_OFFSET)
        this.#backpackTiledStaticImage.setPixelBottom(ItemBar.getItemsBarTiledStaticImage().getPixelY() - padding * 2)
        // calculate the maximum total numbers of items that can be displayed per page
        const ITEM_PER_PAGE = ItemBar.ITEMS_PER_ROW * this.ROWS_PER_PAGE
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
            const _pixelX = Math.floor(this.getPixelX() + (i % ItemBar.ITEMS_PER_ROW) * 5 * this.#backpackTiledStaticImage.getTileWidth() + padding)
            // calculate pixel y of the box
            const _pixelY = Math.floor(this.#backpackTiledStaticImage.getPixelY() + padding + 5 * this.#backpackTiledStaticImage.getTileHeight() * (Math.floor(i / ItemBar.ITEMS_PER_ROW) % this.ROWS_PER_PAGE))
            if (i < inventoryKeys.length) {
                const key = inventoryKeys[i]
                this.drawItem(ctx, key, this.#inventoryContainer.get(key), i + ItemBar.ITEMS_PER_ROW, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            } else {
                this.drawItem(ctx, null, null, i + ItemBar.ITEMS_PER_ROW, _pixelX, _pixelY, this.getBoxSize(), this.getBoxSize())
            }
        }
    }
}