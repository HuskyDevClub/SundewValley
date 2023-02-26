class Npc extends Character {
    constructor(name, x, y, mapRef) {
        super(name, name.toLowerCase(), x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(this.getMapReference().getTileSize() * 1, this.getMapReference().getTileSize() * 1.3)
        this.customHitBox = {x: -1, y: -1, width: 3, height: 3}
    }

    interact() {
        Dialogues.update(this.getName() + "_interact1", this)
    }
}