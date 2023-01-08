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
                if (firstItem.getY() < secondItem.getY()) {
                    return -1
                } else if (firstItem.getY() > secondItem.getY()) {
                    return 1
                } else if (firstItem.getX() < secondItem.getX()) {
                    return -1
                } else if (firstItem.getX() > secondItem.getX()) {
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
    }
}