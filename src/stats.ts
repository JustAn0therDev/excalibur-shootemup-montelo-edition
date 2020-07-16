import Config from "./config";

class Stats {
    hp: number = Config.totalHp;
    gameOver = false;
    score = 0;
    private static _stats: Stats | undefined;

    private constructor() {  }

    public static getInstance(): Stats {
        if (!this._stats)
            this._stats = new Stats();

        return this._stats;
    } 
}

export default Stats.getInstance();