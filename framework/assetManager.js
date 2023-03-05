class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.imageCache = {};
        this.imageDownloadQueue = [];
        this.jsonCache = {};
        this.jsonDownloadQueue = [];
        this.musicCache = {};
        this.musicDownloadQueue = [];
    };

    queueDownloadJson(path) {
        if (Debugger.isDebugging) console.log("Queueing Json" + path);
        this.jsonDownloadQueue.push(path);
    }

    queueDownloadImage(path) {
        if (Debugger.isDebugging) console.log("Queueing Image " + path);
        this.imageDownloadQueue.push(path);
    }

    queueDownloadMusic(path) {
        if (Debugger.isDebugging) console.log("Queueing Music " + path);
        this.musicDownloadQueue.push(path);
    }

    isDone() {
        return this.imageDownloadQueue.length + this.jsonDownloadQueue.length + this.musicDownloadQueue.length === this.successCount + this.errorCount;
    };

    #downloadAllImages(callback) {
        for (let i = 0; i < this.imageDownloadQueue.length; i++) {
            const img = new Image();

            const path = this.imageDownloadQueue[i];

            img.addEventListener("load", () => {
                if (Debugger.isDebugging) console.log("Loaded " + img.src);
                this.successCount++;
                if (this.isDone()) callback();
            });

            img.addEventListener("error", () => {
                if (Debugger.isDebugging) console.log("Error loading " + img.src);
                this.errorCount++;
                if (this.isDone()) callback();
            });

            img.src = path;
            this.imageCache[path] = img;
        }
    };

    #downloadAllJson(callback) {
        for (let i = 0; i < this.jsonDownloadQueue.length; i++) {
            const path = this.jsonDownloadQueue[i];
            fetch(path)
                .then((response) => response.json())
                .then((data) => {
                    this.jsonCache[path] = data;
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

    #downloadAllMusic(callback) {
        for (let i = 0; i < this.musicDownloadQueue.length; i++) {
            const audio = new Audio();
            const path = this.musicDownloadQueue[i];
            audio.addEventListener("loadeddata", () => {
                this.successCount++;
                audio.recentelyEnded = false
                if (Debugger.isDebugging) console.log(`${path} loaded`)
                if (this.isDone()) callback();
            });
            audio.addEventListener("error", () => {
                this.errorCount++;
                if (Debugger.isDebugging) console.log("Error loading " + path);
                if (this.isDone()) callback();
            });
            audio.addEventListener("ended", () => {
                audio.pause()
                audio.recentelyEnded = true
                audio.currentTime = 0
            });
            audio.src = path;
            audio.load()
            this.musicCache[path] = audio;
        }
    };

    downloadAll(callback) {
        if (this.imageDownloadQueue.length + this.jsonDownloadQueue.length + this.musicDownloadQueue.length === 0) setTimeout(callback, 10);
        this.#downloadAllImages(callback)
        this.#downloadAllJson(callback)
        this.#downloadAllMusic(callback)
    };

    #getImageByPath(path) {
        return this.imageCache[path];
    };

    getImageByPath(path) {
        return this.#getImageByPath(path.replace("\/", "/"));
    };

    getImage(...args) {
        return this.#getImageByPath([".", "images"].concat(args).join("/"))
    }

    #getJsonByPath(path) {
        return this.jsonCache[path];
    };

    getJsonByPath(path) {
        return this.#getJsonByPath(path.replace("\/", "/"));
    };

    getJson(...args) {
        return this.#getJsonByPath(["."].concat(args).join("/"))
    }

    #getAudioByPath(path) {
        return this.musicCache[path];
    };

    playMusic(...args) {
        const music = this.#getAudioByPath([".", "audios", "music"].concat(args).join("/"))
        if (document.getElementById("mute").checked) {
            music.volume = 0
        } else {
            music.volume = document.getElementById("volume").value
        }
        music.play()
        if (music.recentelyEnded) {
            music.recentelyEnded = false
            return true
        } else {
            return false
        }
    }

    stopMusic(...args) {
        const music = this.#getAudioByPath([".", "audios", "music"].concat(args).join("/"))
        music.pause()
        music.currentTime = 0
    }

    playSound(...args) {
        const music = this.#getAudioByPath([".", "audios", "sound"].concat(args).join("/"))
        if (document.getElementById("mute").checked) {
            music.volume = 0
        } else {
            music.volume = document.getElementById("volume").value
        }
        music.play()
    }
}

