class Interactable extends Character {

    constructor(name, x, y, mapRef, _customHitBox) {
        super(name, "nothing", x, y, mapRef)
        this.customHitBox = _customHitBox
    }

    getInventory() {
        return Chest.CHESTS[this.getName()];
    }
}