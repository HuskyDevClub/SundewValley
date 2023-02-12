class Font {

    static DEFAULT_TYPE = "arial"

    static draw(ctx, content, fontSize, pixelX, pixelY, fontColor = "white", outlineColor = "black", fontType = this.DEFAULT_TYPE, additionalStyle = "bold") {
        ctx.font = `${additionalStyle} ${Math.floor(fontSize)}px ${fontType}`
        ctx.fillStyle = fontColor;
        ctx.strokeStyle = outlineColor;
        ctx.fillText(content, pixelX, pixelY)
        ctx.strokeText(content, pixelX, pixelY)
    }
}