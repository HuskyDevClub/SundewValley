class Level {

    #map
    #row
    #column
    #entities = []
    #player

    constructor(map) {
        this.#row = map.length
        this.#column = map[0].length
        this.#map = []
        map.forEach(_row => {
            let _cache = []
            _row.forEach(_tile => {
                _cache.push(new Tile(_tile))
            })
            this.#map.push(_cache)
        })
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
        let y = 0
        this.#map.forEach(_row => {
            let x = 0
            _row.forEach(_tile => {
                _tile.draw(ctx, x, y)
                x += 1
            })
            y += 1
        })
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
            entity.draw(ctx)
            if (Debugger.isDebugging) ctx.strokeRect(entity.getPixelX(), entity.getPixelY(), entity.getWidth(), entity.getHeight())
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