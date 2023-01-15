class DateTimeSystem {
    static #data

    static init(yearStarted) {
        this.#data = new Date(yearStarted, 2, 1, 6, 0, 0, 0)
    }

    static getDateObject() {
        return this.#data
    }

    static now() {
        return new Date(this.#data.getTime());
    }

    static getDifferenceInMs(_date) {
        return this.#data.getTime() - _date.getTime();
    }

    static update(time_in_seconds) {
        this.#data.setTime(this.#data.getTime() + time_in_seconds * 60000)
    }

    static getMonth() {
        return this.#data.getMonth() + 1
    }

    static toLocaleString() {
        return this.#data.toLocaleString()
    }

    static getSeason() {
        if (3 <= this.getMonth() && this.getMonth() <= 5) {
            return "spring"
        } else if (6 <= this.getMonth() && this.getMonth() <= 8) {
            return "summer"
        } else if (9 <= this.getMonth() && this.getMonth() <= 11) {
            return "autumn"
        } else {
            return "winter"
        }
    }

}