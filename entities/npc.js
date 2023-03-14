class Npc extends Character {
    constructor(name, x, y, mapRef) {
        super(name, name.toLowerCase(), x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(this.getMapReference().getTileSize() * 1, this.getMapReference().getTileSize() * 1.3)
        this.customHitBox = {x: -1, y: -1, width: 3, height: 3}
        this.dailyClosing()
    }

    interact() {
        Dialogues.update(this.getName() + "_interact1", this)
    }

    dailyClosing() {
        if (this.getName().localeCompare("Amely") === 0) {
            this.clearInventory()
            this.setMoney(getRandomIntInclusive(2000, 5000))
            for (let i = 0; i < 50; i++) {
                const _keys = Object.keys(InventoryItems.PRICES)
                this.obtainItem(_keys[_keys.length * Math.random() << 0], getRandomIntInclusive(1, 3))
            }
        }
    }
}