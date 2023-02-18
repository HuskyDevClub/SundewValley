class Chest extends Character {

    static CHESTS = {
        "TradingBox": {}
    }

    constructor(name, x, y, mapRef) {
        super(name, "nothing", x, y, mapRef)
        if (Chest.CHESTS[this.getName()] == null) Chest.CHESTS[this.getName()] = {}
        mapRef.getParameter("triggers").push({
            "x": x - 0.5,
            "y": y - 0.5,
            "width": 2,
            "height": 2,
            "linkToChest": this,
            "type": "chest"
        })
    }

    getInventory() {
        return Chest.CHESTS[this.getName()];
    }
}