class DateTimeSystem {
    #data = {
        "second": 0,
        "minute": 0,
        "hour": 0,
        "day": 1,
        "month": 3,
        "year": 0
    }
    #bigMonths = [1, 3, 5, 7, 8, 10, 12]

    constructor(yearStarted) {
        this.#data["year"] = Math.max(yearStarted, this.#data["year"])
    }

    update() {
        this.#data["second"] += 1
        this.#checkToReset("second", "minute", 60)
        this.#checkToReset("minute", "hour", 60)
        this.#checkToReset("hour", "day", 24)

        if (this.#data["month"] in this.#bigMonths) {
            this.#checkToReset("day", "month", 32, 1)
        } else if (this.#data["month"] !== 2) {
            this.#checkToReset("day", "month", 31, 1)
        } else {
            if (!this.isLeapYear()) {
                this.#checkToReset("day", "month", 30, 1)
            } else {
                this.#checkToReset("day", "month", 29, 1)
            }
        }
        this.#checkToReset("month", "year", 13, 1)
        if (Debugger.isDebugging) {
            Debugger.pushInfo(`${this.#data["hour"]}:${this.#data["minute"]}:${this.#data["second"]} ${this.#data["month"]}/${this.#data["day"]}/${this.#data["year"]} ${this.getSeason()}`)
        }
    }

    isLeapYear() {
        return this.#data["year"] % 4 === 0
    }

    getMonth() {
        return this.#data["month"]
    }

    getSeason() {
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

    #checkToReset(source, target, sourceMaxExc, resetTo = 0) {
        if (this.#data[source] >= sourceMaxExc) {
            this.#data[source] = resetTo
            this.#data[target] += 1
        }
    }

}