class Level {

    #map
    #row
    #column
    #offsetX = 0
    #offsetY = 0
    #entities = []
    #player
    #tileSets
    #automapTilesFirstGid = -1

    constructor(_path) {
        const mapData = ASSET_MANAGER.getJson(_path)
        this.#row = 0
        this.#column = 0
        let layers = Array.from(mapData["layers"])
        layers.forEach(_layer => {
            this.#row = Math.max(this.#row, parseInt(_layer.height))
            this.#column = Math.max(this.#column, parseInt(_layer.width))
        })
        // pre-allocated space for map
        this.#map = new Array(this.#row).fill(undefined).map(() => new Array(this.#column).fill(undefined).map(() => []))
        layers.forEach(_layer => {
            _layer["chunks"].forEach(_chunk => {
                const chunk_width = parseInt(_chunk.width)
                const chunk_height = parseInt(_chunk.height)
                const chuck_relative_x = _layer["startx"] < 0 ? Math.floor(_chunk["x"] - _layer["startx"]) : _chunk["x"]
                const chuck_relative_y = _layer["starty"] < 0 ? Math.floor(_chunk["y"] - _layer["starty"]) : _chunk["y"]
                console.assert(_chunk["data"].length === chunk_width * chunk_height)
                for (let i = 0; i < _chunk["data"].length; i++) {
                    let x = chuck_relative_x + i % chunk_width
                    let y = chuck_relative_y + Math.floor(i / chunk_width)
                    this.#map[y][x].push(_chunk["data"][i])
                }
            })
        })
        this.#tileSets = Array.from(mapData["tilesets"])
        // if automap-tiles are used for rules, then cache its first gid id
        for (let i = 0; i < this.#tileSets.length; i++) {
            if (this.#tileSets[i]["source"].endsWith("automap-tiles.tsx")) {
                this.#automapTilesFirstGid = this.#tileSets[i]["firstgid"]
                break;
            }
        }
    }

    static getTileSize() {
        return Math.floor(GAME_ENGINE.ctx.canvas.width / 20)
    }

    #drawTile(ctx, _id, x, y) {
        this.#tileSets.forEach(_tileSet => {
            const absId = _id - _tileSet["firstgid"]
            if (absId >= 0 && !_tileSet["source"].endsWith("automap-tiles.tsx")) {
                const jsonPath = _tileSet["source"].replace("..", ".").replace("\/", "/")
                const jsonData = ASSET_MANAGER.getJson(jsonPath)
                const pathSubs = jsonPath.split("/")
                pathSubs[pathSubs.length - 1] = jsonData["image"]
                const imageRef = ASSET_MANAGER.getImage(pathSubs.join('/'))
                const tileWidth = parseInt(jsonData["tilewidth"])
                const tileHeight = parseInt(jsonData["tileheight"])
                ctx.drawImage(imageRef,
                    (absId % (jsonData["imagewidth"] / tileWidth)) * tileWidth, Math.floor(absId / (jsonData["imagewidth"] / tileWidth)) * tileHeight,
                    tileWidth, tileHeight,
                    x * Level.getTileSize() + this.#offsetX, y * Level.getTileSize() + this.#offsetY,
                    Level.getTileSize(), Level.getTileSize()
                )
            }
        })
    }

    canEnterTile(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        if (x < 0 || y < 0 || x >= this.#column || y >= this.#row) {
            return false
        } else if (this.#automapTilesFirstGid > 0) {
            for (let i = 0, n = this.#map[y][x].length; i < n; i++) {
                if (this.#map[y][x][i] === this.#automapTilesFirstGid) {
                    return false
                }
            }
        }
        return true
    }

    getPixelWidth() {
        return this.#column * Level.getTileSize()
    }

    getPixelHeight() {
        return this.#row * Level.getTileSize()
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
        const _entities = []
        this.#entities.forEach(_entity => {
            if (entity !== _entity) {
                if (entity.collideWith(_entity)) {
                    _entities.push(_entity)
                }
            }
        });
        return _entities
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
            Debugger.pushInfo(`map - shape: [${this.#column}, ${this.#row}]`)
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
        for (let y = Math.floor(-this.#offsetY / Level.getTileSize()), rowLen = Math.ceil((ctx.canvas.height - this.#offsetY) / Level.getTileSize()); y < rowLen; y++) {
            for (let x = Math.floor(-this.#offsetX / Level.getTileSize()), columnMax = Math.ceil((ctx.canvas.width - this.#offsetX) / Level.getTileSize()); x < columnMax; x++) {
                this.#map[y][x].forEach(metaId => {
                    this.#drawTile(ctx, metaId, x, y)
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