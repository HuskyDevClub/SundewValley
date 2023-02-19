class Amely extends Character {
    constructor(x, y, mapRef) {
        super("Amely", "amely", x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(this.getMapReference().getTileSize() * 1, this.getMapReference().getTileSize() * 1.3)
    }

    interact() {
        GAME_ENGINE.dialogContent = {
            content: ["Hello my Name is Amely", "I can be used to test interaction", "What can I do for you?"]
        }
    }
}