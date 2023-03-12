class Chest extends Interactable {

    static CHESTS = {
        "TradingBox": {}
    }

    constructor(name, x, y, mapRef) {
        super(name, x, y, mapRef, {x: -0.5, y: -0.5, width: 2, height: 2})
        if (Chest.CHESTS[this.getName()] == null) Chest.CHESTS[this.getName()] = {}
    }

    getInventory() {
        return Chest.CHESTS[this.getName()];
    }
}