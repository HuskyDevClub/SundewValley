class Chest extends Character {

    static CHESTS = {
        "TradingBox": {}
    }

    constructor(name, x, y, mapRef) {
        super(name, "nothing", x, y, mapRef)
        if (Chest.CHESTS[this.getName()] == null) Chest.CHESTS[this.getName()] = {}
        this.customHitBox = {x: -0.5, y: -0.5, width: 2, height: 2}
    }

    getInventory() {
        return Chest.CHESTS[this.getName()];
    }
}