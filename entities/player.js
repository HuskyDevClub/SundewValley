class Player extends Character {
    // whether the player is in idle or not
    #isIdle
    #itemBar

    constructor(name, x, y, mapRef) {
        super(name, "player", x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(this.getMapReference().getTileSize() * 1.5, this.getMapReference().getTileSize() * 1.5)
        this.#isIdle = true
        this.#itemBar = {}
    }

    getItemBar() {
        return this.#itemBar
    }

    obtainItem(key, num = 1) {
        if (super.hasItemInInventory(key)) {
            super.obtainItem(key, num)
        } else if (this.#itemBar[key] != null) {
            this.#itemBar[key]["amount"] += num
        } else if (Object.keys(this.#itemBar).length < InventoryUI.ITEMS_PER_ROW) {
            this.#itemBar[key] = {"amount": num}
        } else {
            super.obtainItem(key, num)
        }
    }

    tryUseItem(key, num = 1) {
        if (super.hasItemInInventory(key)) {
            return super.tryUseItem(key, num)
        } else if (this.#itemBar[key] != null && this.#itemBar[key]["amount"] >= num) {
            this.#itemBar[key]["amount"] -= num
            if (this.#itemBar[key]["amount"] === 0) {
                delete this.#itemBar[key]
            }
            return true
        }
        return false;
    }

    putItemIntoTargetInventory(key, targetRef) {
        if (super.hasItemInInventory(key)) {
            targetRef.obtainItem(key, this.getInventory()[key]["amount"])
            super.tryUseItem(key, this.getInventory()[key]["amount"])
        } else if (this.#itemBar[key] != null && this.#itemBar[key]["amount"] > 0) {
            targetRef.obtainItem(key, this.#itemBar[key]["amount"])
            delete this.#itemBar[key]
        }
    }

    takeItemOutOfTargetInventory(key, targetRef) {
        this.obtainItem(key, targetRef.getInventory()[key]["amount"])
        targetRef.tryUseItem(key, targetRef.getInventory()[key]["amount"])
    }

    putItemIntoInventory(key) {
        super.obtainItem(key, this.#itemBar[key]["amount"])
        delete this.#itemBar[key]
    }

    takeItemOutOfInventory(key) {
        this.#itemBar[key] = {"amount": this.getInventory()[key]["amount"]}
        delete this.getInventory()[key]
    }

    #checkNotLoopAnimation(key, action) {
        if (key === true) {
            this.setCurrentAction(action)
            this.#isIdle = false
            return true
        } else {
            this.getAnimation(action + "_l").resetElapsedTime()
            this.getAnimation(action + "_r").resetElapsedTime()
            return false
        }
    }

    #checkSpecialAction() {
        return !this.#checkNotLoopAnimation(Controller.keys["KeyQ"], "water")
            && !this.#checkNotLoopAnimation(Controller.keys["KeyE"], "dig")
            && !this.#checkNotLoopAnimation(Controller.keys["KeyC"], "cut")
    }

    update() {
        this.#isIdle = true
        this.setCurrentMovingSpeedX(0)
        this.setCurrentMovingSpeedY(0)
        // for dig action, try to convert grass to dirt
        if (this.isCurrentAction("dig") && this.getCurrentAnimation().currentFrame() === 1) {
            if (this.getMapReference() instanceof FarmLevel) this.getMapReference().tryConvertTileToDirt(this.getBlockX(), this.getBlockY())
        }
        // for water action, try to water the ground
        else if (this.isCurrentAction("water") && this.getCurrentAnimation().currentFrame() === 1) {
            if (this.getMapReference() instanceof FarmLevel) this.getMapReference().tryConvertTileToWateredDirt(this.getBlockX(), this.getBlockY())
        }
        // for cut action, try to harvest the crop
        else if (this.isCurrentAction("cut") && this.getCurrentAnimation().currentFrame() === 1) {
            if (this.getMapReference() instanceof FarmLevel) {
                const _crop = this.getMapReference().getCrop(this.getBlockX(), this.getBlockY())
                if (_crop != null && _crop.isMatured()) {
                    _crop.removeFromWorld = true
                    // obtain a random amount of crop
                    this.obtainItem(_crop.getType(), getRandomIntInclusive(1, 3))
                    // obtain a random amount of seed for that crop
                    this.obtainItem(_crop.getType() + "_seed", getRandomIntInclusive(1, 2))
                }
            }
        }
        // check special action
        if (this.#checkSpecialAction() && Transition.isNotActivated() && GAME_ENGINE.getPlayerUi().isNotOpeningAnyChest()) {
            // move left or right
            if (Controller.left === true) {
                this.setDirectionFacing("l")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                this.#isIdle = false
            } else if (Controller.right === true) {
                this.setDirectionFacing("r")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                this.#isIdle = false
            }
            // move up or down
            if (Controller.up === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                this.#isIdle = false
            } else if (Controller.down === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(this.getMovingSpeedY())
                this.#isIdle = false
            }
        }
        if (this.#isIdle) {
            this.setCurrentAction("idle")
        }
        super.update()
    };
}