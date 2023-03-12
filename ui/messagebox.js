class MessageBox {
    static draw(ctx, content, fontSize, dx, dy, paddingX = fontSize, paddingY = fontSize / 2) {
        fontSize = Math.floor(fontSize)
        paddingX = Math.floor(paddingX)
        paddingY = Math.floor(paddingY)
        Font.update(ctx, fontSize)
        const _measurement = Font.measure(ctx, content)
        GUI.draw(ctx, 9, 11, 3, 2, dx, dy, Math.floor(_measurement.width) + paddingX * 2, fontSize + paddingY * 2)
        Font.render(ctx, content, dx + paddingX, Math.floor(dy + paddingY + fontSize * 0.75))
    }

    static drawLines(ctx, contents, fontSize, dx, dy, paddingX = fontSize, paddingY = fontSize / 2, offsetXBaseOnWidth = 0, offsetYBaseOnHeight = 0) {
        fontSize = Math.floor(fontSize)
        paddingX = Math.floor(paddingX)
        paddingY = Math.floor(paddingY)
        Font.update(ctx, fontSize)
        let max_width = 0
        contents.forEach(_text => max_width = Math.max(max_width, Font.measure(ctx, _text).width))
        max_width += paddingX * 2
        const _height = (fontSize + paddingY / 2) * contents.length + paddingY * 2
        dx -= max_width * offsetXBaseOnWidth
        dy -= _height * offsetYBaseOnHeight
        GUI.draw(ctx, 9, 11, 3, 2, dx, dy, max_width, _height)
        for (let i = 0; i < contents.length; i++) {
            Font.render(ctx, contents[i], dx + paddingX, Math.floor(dy + paddingY + (fontSize + paddingY / 2) * i + fontSize * 0.75))
        }
    }
}

class MessageButton {
    static draw(ctx, content, fontSize, dx, dy, paddingX = fontSize, paddingY = fontSize / 2) {
        fontSize = Math.floor(fontSize)
        paddingX = Math.floor(paddingX)
        paddingY = Math.floor(paddingY)
        Font.update(ctx, fontSize)
        const _measurement = Font.measure(ctx, content)
        const dw = Math.floor(_measurement.width) + paddingX * 2
        const dh = fontSize + paddingY * 2
        const isHovered = dx < Controller.mouse.x && Controller.mouse.x < dx + dw && dy < Controller.mouse.y && Controller.mouse.y < dy + dh
        GUI.draw(ctx, 9, isHovered ? 9 : 11, 3, 2, dx, dy, dw, dh)
        Font.render(ctx, content, dx + paddingX, Math.floor(dy + paddingY + _measurement.actualBoundingBoxAscent))
        return isHovered
    }
}