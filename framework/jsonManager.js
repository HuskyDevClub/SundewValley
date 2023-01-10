class JsonManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        if (Debugger.isDebugging) console.log("Queueing Json" + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const path = this.downloadQueue[i];
            fetch(path)
                .then((response) => response.json())
                .then((data) => {
                    this.cache[path] = data;
                    if (Debugger.isDebugging) console.log("Loaded " + path);
                    this.successCount++;
                    if (this.isDone()) callback();
                })
                .catch((error) => {
                    if (Debugger.isDebugging) console.error('There has been a problem with your fetch operation:', error);
                    this.errorCount++;
                    if (this.isDone()) callback();
                })
        }
    };

    getJson(path) {
        return this.cache[path];
    };
}