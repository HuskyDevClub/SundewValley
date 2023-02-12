class MessageBox {
    static draw(ctx, content, fontSize, dx, dy, paddingX = fontSize, paddingY = fontSize / 2) {
        fontSize = Math.floor(fontSize)
        paddingX = Math.floor(paddingX)
        paddingY = Math.floor(paddingY)
        Font.update(ctx, fontSize)
        const _measurement = Font.measure(ctx, content)
        GUI.draw(ctx, 9, 9, 3, 2, dx, dy, Math.floor(_measurement.width) + paddingX * 2, fontSize + paddingY * 2)
        Font.render(ctx, content, dx + paddingX, Math.floor(dy + paddingY + _measurement.actualBoundingBoxAscent))
    }
}