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
        if (this.upConnected) {
            if (this.downConnected) {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 105
                    } else {
                        return 106
                    }
                } else {
                    if (this.rightConnected) {
                        return 104
                    } else {
                        return 103
                    }
                }
            } else {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 114
                    } else {
                        return 115
                    }
                } else {
                    if (this.rightConnected) {
                        return 113
                    } else {
                        return 112
                    }
                }
            }
        } else {
            if (this.downConnected) {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 96
                    } else {
                        return 97
                    }
                } else {
                    if (this.rightConnected) {
                        return 95
                    } else {
                        return 94
                    }
                }
            } else {
                if (this.leftConnected) {
                    if (this.rightConnected) {
                        return 91
                    } else {
                        return 92
                    }
                } else {
                    if (this.rightConnected) {
                        return 90
                    } else {
                        return 93
                    }
                }
            }
        }
    }
}