class DirtTiles {
    static offset = 0

    constructor() {
        this.upConnected = false
        this.downConnected = false
        this.leftConnected = false
        this.rightConnected = false
    }

    static isDirt(absMetaId) {
        absMetaId -= DirtTiles.offset
        return (90 <= absMetaId && absMetaId <= 120) || (126 <= absMetaId && absMetaId <= 129)
    }

    getId() {
        if (!this.upConnected && !this.downConnected && !this.leftConnected && this.rightConnected) {
            return 90
        } else if (!this.upConnected && !this.downConnected && this.leftConnected && this.rightConnected) {
            return 91
        } else if (!this.upConnected && !this.downConnected && this.leftConnected && !this.rightConnected) {
            return 92
        } else if (!this.upConnected && !this.downConnected && !this.leftConnected && !this.rightConnected) {
            return 93
        } else if (!this.upConnected && this.downConnected && !this.leftConnected && !this.rightConnected) {
            return 94
        } else if (this.upConnected && this.downConnected && !this.leftConnected && !this.rightConnected) {
            return 103
        } else if (this.upConnected && !this.downConnected && !this.leftConnected && !this.rightConnected) {
            return 112
        } else if (!this.upConnected && this.downConnected && !this.leftConnected && this.rightConnected) {
            return 95
        } else if (!this.upConnected && this.downConnected && this.leftConnected && this.rightConnected) {
            return 96
        } else if (!this.upConnected && this.downConnected && this.leftConnected && !this.rightConnected) {
            return 97
        } else if (this.upConnected && this.downConnected && !this.leftConnected && this.rightConnected) {
            return 104
        } else if (this.upConnected && this.downConnected && this.leftConnected && this.rightConnected) {
            return 105
        } else if (this.upConnected && this.downConnected && this.leftConnected && !this.rightConnected) {
            return 106
        } else if (this.upConnected && !this.downConnected && !this.leftConnected && this.rightConnected) {
            return 113
        } else if (this.upConnected && !this.downConnected && this.leftConnected && this.rightConnected) {
            return 114
        } else if (this.upConnected && !this.downConnected && this.leftConnected && !this.rightConnected) {
            return 115
        }
        return null
    }
}