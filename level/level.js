class Level {
    #row
    #column
    #entities = []

    constructor(map) {
        this.#row = map.length
        this.#column = map[0].length
    }

    addEntity(entity) {
        this.#entities.push(entity);
    };

    draw(engine) {
        this.#entities.sort(
            function (firstItem, secondItem) {
                if (firstItem.getY() < secondItem.getY()) {
                    return 1
                } else if (firstItem.getY() > secondItem.getY()) {
                    return -1
                } else if (firstItem.getX() < secondItem.getX()) {
                    return 1
                } else if (firstItem.getX() > secondItem.getX()) {
                    return -1
                } else {
                    return 0
                }
            }
        );
        // Draw the latest things first
        for (let i = this.#entities.length - 1; i >= 0; i--) {
            this.#entities[i].draw(engine.ctx, engine);
        }
    };

    update() {
        let entitiesCount = this.#entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.#entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.#entities.length - 1; i >= 0; --i) {
            if (this.#entities[i].removeFromWorld) {
                this.#entities.splice(i, 1);
            }
        }
    }
}