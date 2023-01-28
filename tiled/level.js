class Level extends AbstractTiledMap {
    #entities = []
    #player
    #automapTilesFirstGid = -1
    #offsetX = 0
    #offsetY = 0

    constructor(_path) {
        const mapData = ASSET_MANAGER.getJsonByPath(_path)
        super(mapData)
        // if automap-tiles are used for rules, then cache its first gid id
        for (let i = 0, n = this.getTileSets().length; i < n; i++) {
            if (this.getTileSet(i)["source"].endsWith("automap-tiles.tsx")) {
                this.#automapTilesFirstGid = this.getTileSet(i)["firstgid"]
                break;
            }
        }
    }

    static getTileSize() {
        return Math.floor(GAME_ENGINE.ctx.canvas.width / 20)
    }

    getAbsMetaId(tileSheetType, tileSheetName, tileId) {
        for (let i = this.getTileSets().length - 1; i > 0; i--) {
            const _tileSet = this.getTileSet(i)
            const _src = _tileSet["source"]
            if (_src.endsWith(tileSheetName + ".json") && _src.includes(tileSheetType)) {
                return _tileSet["firstgid"] + tileId
            }
        }
        return null;
    }

    getTileLayerIndex(x, y, tileSheetType, tileSheetName, tileId) {
        return this.getTileLayerIndexUsingFilter(x, y, metaId => metaId === this.getAbsMetaId(tileSheetType, tileSheetName, tileId))
    }

    getTileLayerIndexUsingFilter(x, y, _filter) {
        if (this.isCoordinateInRange(x, y)) {
            const _layers = this.getTile(x, y)
            for (let i = 0, n = _layers.length; i < n; i++) {
                if (_filter(_layers[i])) {
                    return i
                }
            }
        }
        return -1
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

    getPixelWidth() {
        return this.getColumn() * Level.getTileSize()
    }

    getPixelHeight() {
        return this.getRow() * Level.getTileSize()
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
        this.addEntity(this.#player);
        this.addEntity(new Chicken("black_chicken", 10, 10, this));
        this.addEntity(new Cow("strawberry_cow", 10, 10, this));
        this.addEntity(new Goat("brown_goat", 10, 10, this));
        this.addEntity(new Pig("pink_pig", 10, 10, this));
        this.addEntity(new Sheep("fluffy_white_sheep_sheet", 10, 10, this));
        this.addEntity(new Crop("potato", 15, 12));
    };

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
            Debugger.pushInfo(`image size:[${this.getPixelWidth()}, ${this.getPixelHeight()}]; offset: [${this.#offsetX}, ${this.#offsetY}]`)
            this.#entities.forEach(entity => {
                Debugger.pushInfo("--------------------")
                if (entity instanceof Character) {
                    Debugger.pushInfo(`name: ${entity.getName()}`)
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
        if (this.#player.getPixelRight() + this.#offsetX > ctx.canvas.width * 0.9) {
            this.#offsetX -= Math.floor(this.#player.getMovingSpeedX() * 1.5)
        } else if (this.#player.getPixelX() + this.#offsetX < ctx.canvas.width * 0.1) {
            this.#offsetX += Math.floor(this.#player.getMovingSpeedX() * 1.5)
        }
        this.#offsetX = Math.max(Math.min(this.#offsetX, 0), ctx.canvas.width - this.getPixelWidth())
        // fix offset y
        if (this.#player.getPixelBottom() + this.#offsetY > ctx.canvas.height * 0.9) {
            this.#offsetY -= Math.floor(this.#player.getMovingSpeedY() * 1.5)
        } else if (this.#player.getPixelY() + this.#offsetY < ctx.canvas.height * 0.1) {
            this.#offsetY += Math.floor(this.#player.getMovingSpeedY() * 1.5)
        }
        this.#offsetY = Math.max(Math.min(this.#offsetY, 0), ctx.canvas.height - this.getPixelHeight())
        // draw map
        const _size = Level.getTileSize()
        for (let y = Math.floor(-this.#offsetY / Level.getTileSize()), rowLen = Math.ceil((ctx.canvas.height - this.#offsetY) / Level.getTileSize()); y < rowLen; y++) {
            for (let x = Math.floor(-this.#offsetX / Level.getTileSize()), columnMax = Math.ceil((ctx.canvas.width - this.#offsetX) / Level.getTileSize()); x < columnMax; x++) {
                this.getTile(x, y).forEach(metaId => {
                    this.drawTile(ctx, metaId, x * _size + this.#offsetX, y * _size + this.#offsetY, _size)
                })
            }
        }
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
            entity.display(ctx, this.#offsetX, this.#offsetY)
            if (Debugger.isDebugging) ctx.strokeRect(entity.getPixelX() + this.#offsetX, entity.getPixelY() + this.#offsetY, entity.getWidth(), entity.getHeight())
        });
    };

}