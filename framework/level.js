class Level {

    #map = []
    #row
    #column
    #tileWidth
    #tileHeight
    #offsetX = 0
    #offsetY = 0
    #entities = []
    #player
    #mapImage
    #scale

    constructor(_path) {
        const mapData = JSON_MANAGER.getJson(_path)
        this.#row = 0
        this.#column = 0
        this.#tileWidth = mapData["tilewidth"]
        this.#tileHeight = mapData["tileheight"]
        Array.from(mapData["layers"]).forEach(_layer => {
            this.#row = Math.max(this.#row, parseInt(_layer.height))
            this.#column = Math.max(this.#column, parseInt(_layer.width))
        })
        this.#mapImage = ASSET_MANAGER.getAsset(_path.replace(".json", ".png"))
        console.assert(this.#mapImage.width === this.#column * this.#tileWidth)
        console.assert(this.#mapImage.height === this.#row * this.#tileHeight)
        this.#scale = Tile.getTileSize() / this.#tileWidth
    }

    getPixelWidth() {
        return this.#mapImage.width * this.#scale
    }

    getPixelHeight() {
        return this.#mapImage.height * this.#scale
    }

    addEntity(entity) {
        this.#entities.push(entity);
    };

    initEntities() {
        let playerName = "Cody"
        /*while (playerName == null){
            playerName = prompt("Please enter player name", "Cody");
        }*/
        this.#player = new Player(playerName, 10, 10)
        this.addEntity(this.#player);
        this.addEntity(new Chicken("black_chicken", 10, 10));
        this.addEntity(new Cow("strawberry_cow", 10, 10));
        this.addEntity(new Goat("brown_goat", 10, 10));
        this.addEntity(new Pig("pink_pig", 10, 10));
        this.addEntity(new Sheep("fluffy_white_sheep_sheet", 10, 10));
        this.addEntity(new Crop("potato", 10, 10));
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

    draw(ctx) {
        // fix offset x
        if (this.#player.getPixelRight() + this.#offsetX > ctx.canvas.width * 0.9) {
            this.#offsetX -= Math.ceil(this.#player.getMovingSpeedX() * 1.5)
        } else if (this.#player.getPixelX() + this.#offsetX < ctx.canvas.width * 0.1) {
            this.#offsetX += Math.ceil(this.#player.getMovingSpeedX() * 1.5)
        }
        this.#offsetX = Math.max(Math.min(this.#offsetX, 0), ctx.canvas.width - this.getPixelWidth())
        // fix offset y
        if (this.#player.getPixelBottom() + this.#offsetY > ctx.canvas.height * 0.9) {
            this.#offsetY -= Math.ceil(this.#player.getMovingSpeedY() * 1.5)
        } else if (this.#player.getPixelY() + this.#offsetY < ctx.canvas.height * 0.1) {
            this.#offsetY += Math.ceil(this.#player.getMovingSpeedY() * 1.5)
        }
        this.#offsetY = Math.max(Math.min(this.#offsetY, 0), ctx.canvas.height - this.getPixelHeight())
        // ensure player not go out of bound
        if (this.#player.getBlockX() < 0.5) {
            this.#player.setBlockX(0.5)
        } else if (this.#player.getBlockX() > this.#column - 0.5) {
            this.#player.setBlockX(this.#column - 0.5)
        }
        if (this.#player.getBlockY() < 1) {
            this.#player.setBlockY(1)
        }
        if (this.#player.getBlockY() > this.#row) {
            this.#player.setBlockY(this.#row)
        }
        // draw map
        ctx.drawImage(this.#mapImage,
            -this.#offsetX / this.#scale, -this.#offsetY / this.#scale,
            ctx.canvas.width / this.#scale, ctx.canvas.height / this.#scale,
            0, 0,
            ctx.canvas.width, ctx.canvas.height
        );
        // sort entities based on coordinates
        this.#entities.sort(
            function (firstItem, secondItem) {
                if (firstItem.getPixelY() < secondItem.getPixelY()) {
                    return -1
                } else if (firstItem.getPixelY() > secondItem.getPixelY()) {
                    return 1
                } else if (firstItem.getPixelX() < secondItem.getPixelX()) {
                    return -1
                } else if (firstItem.getPixelX() > secondItem.getPixelX()) {
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

    update() {
        this.#entities.forEach(entity => {
            if (!entity.removeFromWorld) {
                entity.update();
            }
        });

        for (let i = this.#entities.length - 1; i >= 0; --i) {
            if (this.#entities[i].removeFromWorld) {
                this.#entities.splice(i, 1);
            }
        }

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
}