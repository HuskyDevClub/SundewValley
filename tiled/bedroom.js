class Bedroom extends Level {
    constructor(_path) {
        super(_path);
    }

    processTriggers(_data) {
        if (_data.type.localeCompare("bed") === 0) {
            const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2
            if (MessageButton.draw(
                GAME_ENGINE.ctx, "Sleep", _fontSize,
                Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3, Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
            )) {
                if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                    Transition.start(() => {
                        DateTimeSystem.toNextDay()
                        const keys = Object.keys(Level.CHESTS.TradingBox)
                        keys.forEach(_key => {
                            if (PRICES[_key] != null) {
                                Level.PLAYER.earnMoney(PRICES[_key] * Level.CHESTS.TradingBox[_key]["amount"])
                                delete Level.CHESTS.TradingBox[_key]
                            }
                        })
                    })
                }
            }
        } else {
            super.processTriggers(_data)
        }
    }
}