class Debugger {

    static isDebugging = false

    static debugDashboard = null

    static switchDebugMode() {
        this.isDebugging = document.getElementById("debug").checked;
        this.update();
    }

    static #ensureDebugDashboard() {
        if (this.debugDashboard == null) {
            this.debugDashboard = document.getElementById('debugDashboard')
        }
    }

    static update() {
        this.#ensureDebugDashboard()
        this.debugDashboard.innerHTML = "";
    }

    static pushInfo(text) {
        this.#ensureDebugDashboard()
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(text));
        this.debugDashboard.appendChild(entry);
    }

}