class Animator {
    constructor(sprite_sheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, {
            sprite_sheet,
            xStart,
            yStart,
            height,
            width,
            frameCount,
            frameDuration,
            framePadding,
            reverse,
            loop
        });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

    };

    resetElapsedTime() {
        this.elapsedTime = 0;
    }

    drawFrame(tick, ctx, x, y, width, height) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;

        ctx.drawImage(this.sprite_sheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
            this.width, this.height,
            x, y,
            width,
            height);
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
}