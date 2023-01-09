class Level {

    #map
    #row
    #column
    #entities = []
    #dateTimeSystem = new DateTimeSystem()

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

    draw(ctx) {
        let y = 0
        this.#map.forEach(_row => {
            let x = 0
            _row.forEach(_tile => {
                _tile.draw(ctx, x, y, this.#dateTimeSystem.getSeason())
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
        this.#entities.forEach(entity => entity.draw(ctx));
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
        this.#dateTimeSystem.update()
        if (Debugger.isDebugging) {
            this.#entities.forEach(entity => {
                Debugger.pushInfo("--------------------")
                Debugger.pushInfo(`type: ${entity.getType()}; size: [${entity.getWidth()}, ${entity.getHeight()}]`)
                Debugger.pushInfo(`pixel pos: [${entity.getPixelX()}, ${entity.getPixelY()}]; block pos: [${Math.round(entity.getBlockX() * 100) / 100}, ${Math.round(entity.getBlockY() * 100) / 100}]`)
                Debugger.pushInfo(`speed: ${entity.getMovingSpeed()}; current action: ${entity.getCurrentAction()}`)
            });
        }
    }
}