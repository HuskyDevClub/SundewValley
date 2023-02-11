class Level extends AbstractTiledMap {
    static PLAYER
    #entities = []
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

    static #setPlayerCoordinate(x, y) {
        this.PLAYER.setBlockX(x)
        this.PLAYER.setBlockY(y)
        const theCurrentLevel = this.PLAYER.getMapReference()
        theCurrentLevel.setPixelX(-this.PLAYER.getBlockX() * theCurrentLevel.getTileSize() + GAME_ENGINE.ctx.canvas.width / 2)
        theCurrentLevel.setPixelY(-this.PLAYER.getBlockY() * theCurrentLevel.getTileSize() + GAME_ENGINE.ctx.canvas.height / 2)
    }

    getTileSize() {
        return this.getTileWidth()
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
        this.#entities = []
        if (Level.PLAYER == null) {
            let playerName = "Cody"
            /*while (playerName == null){
                playerName = prompt("Please enter player name", "Cody");
            }*/
            Level.PLAYER = new Player(playerName, 0, 0, this)
            let _spawn = this.getParameter("spawn")
            if (_spawn == null) _spawn = [0, 0]
            Level.#setPlayerCoordinate(_spawn[0], _spawn[1])
            Level.PLAYER.obtainItem("potato_seed")
            Level.PLAYER.obtainItem("potato", 2)
            Level.PLAYER.obtainItem("corn", 2)
            Level.PLAYER.obtainItem("pea", 2)
            Level.PLAYER.obtainItem("pumpkin_seed", 2)
            Level.PLAYER.obtainItem("cabbage_seed", 2)
            Level.PLAYER.obtainItem("grain_seed", 2)
            Level.PLAYER.obtainItem("grain_seed", 2)
            Level.PLAYER.obtainItem("cabbage", 2)
            Level.PLAYER.obtainItem("grain_seed", 5)
            Level.PLAYER.obtainItem("pea", 2)
            Level.PLAYER.obtainItem("lavender_seed", 2)
            Level.PLAYER.obtainItem("tomato", 9)
            Level.PLAYER.obtainItem("strawberry", 10)
        }
        Level.PLAYER.setMapReference(this)
        this.addEntity(Level.PLAYER);
        /*
        this.addEntity(new Chicken("black_chicken", 10, 10, this));
        this.addEntity(new Cow("strawberry_cow", 10, 10, this));
        this.addEntity(new Goat("brown_goat", 10, 10, this));
        this.addEntity(new Pig("pink_pig", 10, 10, this));
        this.addEntity(new Sheep("fluffy_white_sheep_sheet", 10, 10, this));
        this.addEntity(new Crop("potato", 15, 12, this));*/
    };

    getEntityUsingFilter(_filter) {
        for (let i = this.#entities.length - 1; i >= 0; i--) {
            if (_filter(this.#entities[i])) {
                return this.#entities[i]
            }
        }
        return null
    }

    getEntitiesThatCollideWith(entity) {
        return this.#entities.filter(_entity => entity !== _entity && entity.collideWith(_entity))
    }

    logDebugInfo() {
        super.logDebugInfo()
        this.#entities.sort((entity1, entity2) => entity1.getType().localeCompare(entity2.getType()) || entity1.getUid() - entity2.getUid())
        this.#entities.forEach(entity => {
            Debugger.pushInfo("--------------------")
            if (entity instanceof Character) {
                Debugger.pushInfo(`name: ${entity.getName()}`)
                Debugger.pushInfo("inventory:")
                Object.keys(entity.getItemBar()).forEach(key => {
                    Debugger.pushInfo(`- ${key}: ${JSON.stringify(entity.getItemBar()[key])}`)
                })
                Object.keys(entity.getInventory()).forEach(key => {
                    Debugger.pushInfo(`-- ${key}: ${JSON.stringify(entity.getInventory()[key])}`)
                })
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
        const entitiesThatCollideWithPlayer = this.getEntitiesThatCollideWith(Level.PLAYER)
        Debugger.pushInfo(`Total entities that collide with the player: ${entitiesThatCollideWithPlayer.length}`)
        if (entitiesThatCollideWithPlayer.length > 0) {
            const names = []
            entitiesThatCollideWithPlayer.forEach(_entity => names.push(_entity.getType()))
            Debugger.pushInfo(`Entities that collide with the player: ${names}`)
        }
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
            this.logDebugInfo()
        }
    }

    draw(ctx) {
        // fix offset x
        if (Level.PLAYER.getPixelRight() + this.getPixelX() > ctx.canvas.width * 0.9) {
            this.setPixelX(this.getPixelX() - Math.floor(Level.PLAYER.getMovingSpeedX() * 1.5))
        } else if (Level.PLAYER.getPixelX() + this.getPixelX() < ctx.canvas.width * 0.1) {
            this.setPixelX(this.getPixelX() + Math.floor(Level.PLAYER.getMovingSpeedX() * 1.5))
        }
        this.setPixelX(Math.max(Math.min(this.getPixelX(), 0), ctx.canvas.width - this.getWidth()))
        // fix offset y
        if (Level.PLAYER.getPixelBottom() + this.getPixelY() > ctx.canvas.height * 0.9) {
            this.setPixelY(this.getPixelY() - Math.floor(Level.PLAYER.getMovingSpeedY() * 1.5))
        } else if (Level.PLAYER.getPixelY() + this.getPixelY() < ctx.canvas.height * 0.1) {
            this.setPixelY(this.getPixelY() + Math.floor(Level.PLAYER.getMovingSpeedY() * 1.5))
        }
        this.setPixelY(Math.max(Math.min(this.getPixelY(), 0), ctx.canvas.height - this.getHeight()))
        // draw map group layers
        this.drawTiles(
            ctx,
            Math.floor(-this.getPixelX() / this.getTileSize()), Math.ceil((ctx.canvas.width - this.getPixelX()) / this.getTileSize()),
            Math.floor(-this.getPixelY() / this.getTileSize()), Math.ceil((ctx.canvas.height - this.getPixelY()) / this.getTileSize()),
            0, this.getParameter("groupLevelEndAtIndex")
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
        // Draw all the teleportation points
        const teleportationPoints = this.getParameter("teleportation")
        if (teleportationPoints != null) {
            teleportationPoints.forEach(_pos => {
                const trigger = new Trigger(
                    this.getTilePixelX(_pos.x), this.getTilePixelY(_pos.y),
                    this.getTileSize() * _pos.width, this.getTileSize() * _pos.height,
                    _pos.x, _pos.y, _pos.width, _pos.height,
                )
                if (trigger.collideWith(Level.PLAYER)) {
                    GAME_ENGINE.enterLevel(_pos["destinationLevel"])
                    Level.PLAYER.setMapReference(GAME_ENGINE.getCurrentLevel())
                    Level.#setPlayerCoordinate(_pos["destinationX"], _pos["destinationY"])
                    return undefined;
                } else if (Debugger.isDebugging) {
                    ctx.strokeStyle = 'red';
                    trigger.draw(ctx)
                    ctx.strokeStyle = 'black';
                }
            })
        }
        // If there is top layers on the top of ground layers
        const theGroupLevelEndAtIndex = this.getParameter("groupLevelEndAtIndex")
        if (theGroupLevelEndAtIndex != null) {
            this.drawTiles(
                ctx,
                Math.max(Math.floor(-this.getPixelX() / this.getTileSize()), 0), Math.min(Math.ceil((ctx.canvas.width - this.getPixelX()) / this.getTileSize()), this.getColumn()),
                Math.max(Math.floor(-this.getPixelY() / this.getTileSize()), 0), Math.min(Math.ceil((ctx.canvas.height - this.getPixelY()) / this.getTileSize()), this.getRow()),
                theGroupLevelEndAtIndex, null
            )
        }
        // if this is an interior scene
        if (this.getParameter("interior") == null || this.getParameter("interior") === false) {
            // adding affect for day night cycle
            if (!(DateTimeSystem.getHour() > 6 && DateTimeSystem.getHour() < 17)) {
                if (DateTimeSystem.getHour() >= 17 && DateTimeSystem.getHour() <= 21) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${(DateTimeSystem.getHour() - 17) * 0.225})`;
                } else if (DateTimeSystem.getHour() >= 4 && DateTimeSystem.getHour() <= 6) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${0.9 - (DateTimeSystem.getHour() - 4) * 0.45})`;
                } else {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
                }
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }
    };
}