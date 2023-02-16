class Chest extends Inventory {

    constructor(characterRef) {
        super(characterRef, "./ui/chest.json")
        this.BLOCK_X_OFFSET = -4
        this.ROWS_PER_PAGE = 3
    }

    noContainerIsHovering() {
        return super.noContainerIsHovering()
    }

    draw(ctx) {
        super.draw(ctx)
        this.getBackpackTiledStaticImage().setPixelBottom(this.getBackpackTiledStaticImage().getPixelY())
        this.getBackpackTiledStaticImage().draw(ctx)
    }
}