class Font {

    static DEFAULT_TYPE = "arial"

    static update(ctx, fontSize, fontColor = "white", outlineColor = "black", fontType = this.DEFAULT_TYPE, additionalStyle = "bold") {
        ctx.font = `${additionalStyle} ${Math.floor(fontSize)}px ${fontType}`
        ctx.fillStyle = fontColor;
        ctx.strokeStyle = outlineColor;
    }

    static render(ctx, content, pixelX, pixelY, withOutline = true) {
        ctx.fillText(content, pixelX, pixelY)
        if (withOutline) ctx.strokeText(content, pixelX, pixelY)
    }

    static measure(ctx, content) {
        return ctx.measureText(content)
    }

    static draw(ctx, content, fontSize, pixelX, pixelY, fontColor = "white", outlineColor = "black", fontType = this.DEFAULT_TYPE, additionalStyle = "bold", withOutline = true) {
        this.update(ctx, fontSize, fontColor, outlineColor, fontType, additionalStyle)
        this.render(ctx, content, pixelX, pixelY, withOutline)
    }
}