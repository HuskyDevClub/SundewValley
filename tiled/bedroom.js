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
                    Transition.start(() => DateTimeSystem.toNextDay())
                }
            }
        } else {
            super.processTriggers(_data)
        }
    }
}