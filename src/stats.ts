import Config from "./config";

class Stats {
    public hp: number = Config.totalHp;
    public gameOver: boolean = false;
    public score: number = 0;
    public reset() {
        this.hp = Config.totalHp;
    }
}

export default new Stats();