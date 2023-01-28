class WateredDirtTiles {
    static offset = 0

    constructor() {
        this.upConnected = false
        this.downConnected = false
        this.leftConnected = false
        this.rightConnected = false
    }

    static isWateredDirt(absMetaId) {
        absMetaId -= DirtTiles.offset
        return (121 <= absMetaId && absMetaId <= 124) || (130 <= absMetaId && absMetaId <= 160)
    }

    getId() {
        if (this.upConnected) {
            if (this.downConnected) {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 132
                    } else {
                        return 133
                    }
                } else {
                    if (this.rightConnected) {
                        return 131
                    } else {
                        return 130
                    }
                }
            } else {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 141
                    } else {
                        return 142
                    }
                } else {
                    if (this.rightConnected) {
                        return 140
                    } else {
                        return 139
                    }
                }
            }
        } else {
            if (this.downConnected) {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 123
                    } else {
                        return 124
                    }
                } else {
                    if (this.rightConnected) {
                        return 122
                    } else {
                        return 121
                    }
                }
            } else {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 136
                    } else {
                        return 137
                    }
                } else {
                    if (this.rightConnected) {
                        return 135
                    } else {
                        return 138
                    }
                }
            }
        }
    }
}