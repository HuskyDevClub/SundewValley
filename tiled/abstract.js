class AbstractTiledMap {

    #map
    #row
    #column
    #tileSets

    constructor(mapData) {
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
    }

    getRow() {
        return this.#row
    }

    getColumn() {
        return this.#column
    }

    getTileSet(index) {
        return this.#tileSets[index]
    }

    getTileSets() {
        return this.#tileSets
    }

    isCoordinateInRange(x, y) {
        return x >= 0 && y >= 0 && x < this.#column && y < this.#row
    }

    getTile(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        return this.#map[y][x]
    }

    drawTile(ctx, _id, pixelX, pixelY, _size) {
        for (let i = this.#tileSets.length - 1; i >= 0; i--) {
            const _tileSet = this.#tileSets[i]
            const absId = _id - _tileSet["firstgid"]
            if (absId >= 0) {
                if (!_tileSet["source"].endsWith("automap-tiles.tsx")) {
                    const jsonPath = _tileSet["source"].replace("..", ".")
                    const jsonData = ASSET_MANAGER.getJsonByPath(jsonPath)
                    const pathSubs = jsonPath.split("/")
                    pathSubs[pathSubs.length - 1] = jsonData["image"]
                    const imageRef = ASSET_MANAGER.getImageByPath(pathSubs.join('/'))
                    const tileWidth = parseInt(jsonData["tilewidth"])
                    const tileHeight = parseInt(jsonData["tileheight"])
                    ctx.drawImage(imageRef,
                        (absId % jsonData["columns"]) * tileWidth, Math.floor(absId / jsonData["columns"]) * tileHeight,
                        tileWidth, tileHeight, pixelX, pixelY, _size, _size
                    )
                }
                break;
            }
        }
    }
}