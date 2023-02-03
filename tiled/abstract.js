class AbstractTiledMap extends Abstract2dGameObject {

    #map
    #row
    #minX
    #minY
    #column
    #tileSets
    #tileSize = 0

    constructor(_path) {
        super(0, 0)
        const _data = ASSET_MANAGER.getJsonByPath(_path)
        this.#row = 0
        this.#column = 0
        this.#minX = 0
        this.#minY = 0
        let layers = Array.from(_data["layers"])
        layers.forEach(_layer => {
            this.#row = Math.max(this.#row, _layer.height)
            this.#column = Math.max(this.#column, _layer.width)
            this.#minX = _layer["startx"] != null ? Math.min(this.#minX, _layer["startx"]) : Math.min(this.#minX, _layer["x"])
            this.#minY = _layer["starty"] != null ? Math.min(this.#minY, _layer["starty"]) : Math.min(this.#minX, _layer["y"])
        })
        // pre-allocated space for map
        this.#map = new Array(this.#row).fill(undefined).map(() => new Array(this.#column).fill(undefined).map(() => []))
        layers.forEach(_layer => {
            if (_layer["chunks"] != null) {
                _layer["chunks"].forEach(_chunk => this.#processChunk(_chunk))
            } else {
                this.#processChunk(_layer)
            }
        })
        this.#tileSets = Array.from(_data["tilesets"])
        this.setTileSize(Math.floor(GAME_ENGINE.ctx.canvas.width / 20))
    }

    getTileSize() {
        return this.#tileSize
    }

    setTileSize(size) {
        this.#tileSize = size
    }

    getWidth() {
        return this.getColumn() * this.getTileSize()
    }

    getHeight() {
        return this.getRow() * this.getTileSize()
    }

    #processChunk(_chunk) {
        const chunk_width = parseInt(_chunk.width)
        console.assert(_chunk["data"].length === chunk_width * parseInt(_chunk.height))
        for (let i = 0; i < _chunk["data"].length; i++) {
            let x = _chunk["x"] - this.#minX + i % chunk_width
            let y = _chunk["y"] - this.#minY + Math.floor(i / chunk_width)
            this.getTile(x, y).push(_chunk["data"][i])
        }
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

    isCoordinateInRange(x, y) {
        return x >= 0 && y >= 0 && x < this.#column && y < this.#row
    }

    getTile(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        return this.#map[y][x]
    }

    getTileOnPixel(pixelX, pixelY, _size) {
        const x = Math.floor((pixelX - this.getPixelX()) / _size)
        const y = Math.floor((pixelY - this.getPixelY()) / _size)
        return this.isCoordinateInRange(x, y) ? this.getTile(x, y) : null
    }

    drawTile(ctx, _id, pixelX, pixelY) {
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
                        tileWidth, tileHeight, pixelX, pixelY, this.#tileSize, this.#tileSize
                    )
                }
                break;
            }
        }
    }

    drawTiles(ctx, xStart, xEndExclude, yStart, yEndExclude, layerStart, layerEnd, pixelX, pixelY) {
        if (xStart == null) xStart = 0
        if (yStart == null) yStart = 0
        if (xEndExclude == null) xEndExclude = this.#column
        if (yEndExclude == null) yEndExclude = this.#row
        if (layerStart == null) layerStart = 0
        for (let y = yStart; y < yEndExclude; y++) {
            for (let x = xStart; x < xEndExclude; x++) {
                const currentTile = this.#map[y][x]
                for (let i = layerStart, n = layerEnd == null ? currentTile.length : layerEnd; i < n; i++) {
                    this.drawTile(ctx, currentTile[i], x * this.#tileSize + pixelX, y * this.#tileSize + pixelY)
                }
            }
        }
    }
}