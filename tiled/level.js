class Level extends AbstractTiledMap {
    #entities = []
    #player
    #automapTilesFirstGid = -1

    constructor(_path) {
        super(_path)
        // if automap-tiles are used for rules, then cache its first gid id
        for (let i = 0, n = this.getTileSets().length; i < n; i++) {
            if (this.getTileSet(i)["source"].endsWith("automap-tiles.tsx")) {
                this.#automapTilesFirstGid = this.getTileSet(i)["firstgid"]
                break;
            }
        }
    }

    findEntity(_filter) {
        return this.#entities.find(_filter)
    }

    canEnterTile(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        if (!this.isCoordinateInRange(x, y)) {
            return false
        } else if (this.#automapTilesFirstGid > 0) {
            return this.getTileLayerIndexUsingFilter(x, y, metaId => metaId === this.#automapTilesFirstGid) < 0
        }
        return true
    }

    addEntity(entity) {
        this.#entities.push(entity);
    };

    initEntities() {
        let playerName = "Cody"
        /*while (playerName == null){
            playerName = prompt("Please enter player name", "Cody");
        }*/
        this.#player = new Player(playerName, 10, 10, this)
        this.#player.obtainItem("potato_seed")
        this.addEntity(this.#player);
        this.addEntity(new Chicken("black_chicken", 10, 10, this));
        this.addEntity(new Cow("strawberry_cow", 10, 10, this));
        this.addEntity(new Goat("brown_goat", 10, 10, this));
        this.addEntity(new Pig("pink_pig", 10, 10, this));
        this.addEntity(new Sheep("fluffy_white_sheep_sheet", 10, 10, this));
        this.addEntity(new Crop("potato", 15, 12, this));
    };

    getPlayer() {
        return this.#player
    }

    getEntitiesThatCollideWith(entity) {
        return this.#entities.filter(_entity => entity !== _entity && entity.collideWith(_entity))
    }

    update() {
        // update all the entities
        this.#entities.forEach(entity => {
            if (!entity.removeFromWorld) {
                entity.update();
            }
        });
        // remove entities from world if needed
        for (let i = this.#entities.length - 1; i >= 0; --i) {
            if (this.#entities[i].removeFromWorld) {
                this.#entities.splice(i, 1);
            }
        }
        //output debug information
        if (Debugger.isDebugging) {
            Debugger.pushInfo(`map - shape: [${this.getColumn()}, ${this.getRow()}]`)
            Debugger.pushInfo(`image size:[${this.getWidth()}, ${this.getHeight()}]; offset: [${this.getPixelX()}, ${this.getPixelY()}]`)
            Debugger.pushInfo(`tile is hovering: [${this.getTileOnPixel(Controller.mouse.x, Controller.mouse.y, this.getTileSize())}]`)
            this.#entities.sort((entity1, entity2) => entity1.getType().localeCompare(entity2.getType()) || entity1.getUid() - entity2.getUid())
            this.#entities.forEach(entity => {
                Debugger.pushInfo("--------------------")
                if (entity instanceof Character) {
                    Debugger.pushInfo(`name: ${entity.getName()}`)
                    Debugger.pushInfo(`inventory: ${JSON.stringify(entity.getInventory())}`)
                }
                Debugger.pushInfo(`type: ${entity.getType()}; size: [${entity.getWidth()}, ${entity.getHeight()}]`)
                Debugger.pushInfo(`pixel pos: [${entity.getPixelX()}, ${entity.getPixelY()}]; block pos: [${Math.round(entity.getBlockX() * 100) / 100}, ${Math.round(entity.getBlockY() * 100) / 100}]`)
                if (entity instanceof Creature) {
                    Debugger.pushInfo(`current speed: [${entity.getCurrentMovingSpeedX()} ${entity.getCurrentMovingSpeedY()}]; current action: ${entity.getCurrentAction()}`)
                } else if (entity instanceof Crop) {
                    Debugger.pushInfo(`current stage: ${entity.getStage()}; time until stage: ${entity.getTimeUntilNextStageInMs()}`)
                }
            });
            Debugger.pushInfo("--------------------")
            const entitiesThatCollideWithPlayer = this.getEntitiesThatCollideWith(this.#player)
            Debugger.pushInfo(`Total entities that collide with the player: ${entitiesThatCollideWithPlayer.length}`)
            if (entitiesThatCollideWithPlayer.length > 0) {
                const names = []
                entitiesThatCollideWithPlayer.forEach(_entity => names.push(_entity.getType()))
                Debugger.pushInfo(`Entities that collide with the player: ${names}`)
            }
        }
    }

    draw(ctx) {
        // fix offset x
        if (this.#player.getPixelRight() + this.getPixelX() > ctx.canvas.width * 0.9) {
            this.setPixelX(this.getPixelX() - Math.floor(this.#player.getMovingSpeedX() * 1.5))
        } else if (this.#player.getPixelX() + this.getPixelX() < ctx.canvas.width * 0.1) {
            this.setPixelX(this.getPixelX() + Math.floor(this.#player.getMovingSpeedX() * 1.5))
        }
        this.setPixelX(Math.max(Math.min(this.getPixelX(), 0), ctx.canvas.width - this.getWidth()))
        // fix offset y
        if (this.#player.getPixelBottom() + this.getPixelY() > ctx.canvas.height * 0.9) {
            this.setPixelY(this.getPixelY() - Math.floor(this.#player.getMovingSpeedY() * 1.5))
        } else if (this.#player.getPixelY() + this.getPixelY() < ctx.canvas.height * 0.1) {
            this.setPixelY(this.getPixelY() + Math.floor(this.#player.getMovingSpeedY() * 1.5))
        }
        this.setPixelY(Math.max(Math.min(this.getPixelY(), 0), ctx.canvas.height - this.getHeight()))
        // draw map
        this.drawTiles(
            ctx,
            Math.floor(-this.getPixelX() / this.getTileSize()), Math.ceil((ctx.canvas.width - this.getPixelX()) / this.getTileSize()),
            Math.floor(-this.getPixelY() / this.getTileSize()), Math.ceil((ctx.canvas.height - this.getPixelY()) / this.getTileSize()),
            this.getPixelX(), this.getPixelY()
        )
        // sort entities based on coordinates
        this.#entities.sort(
            function (firstItem, secondItem) {
                if (firstItem.getBlockY() < secondItem.getBlockY()) {
                    return -1
                } else if (firstItem.getBlockY() > secondItem.getBlockY()) {
                    return 1
                } else if (firstItem.getBlockX() < secondItem.getBlockX()) {
                    return -1
                } else if (firstItem.getBlockX() > secondItem.getBlockX()) {
                    return 1
                } else {
                    return 0
                }
            }
        );
        // Draw all the entities
        this.#entities.forEach(entity => {
            entity.display(ctx, this.getPixelX(), this.getPixelY())
            if (Debugger.isDebugging) ctx.strokeRect(entity.getPixelX() + this.getPixelX(), entity.getPixelY() + this.getPixelY(), entity.getWidth(), entity.getHeight())
        });
    };

}