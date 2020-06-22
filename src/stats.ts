import Config from "./config";

class Stats {
    hp: number = Config.totalHp;
    gameOver: boolean = false;
    score: number = 0;
    reset() {
        this.hp = Config.totalHp;
    }
}

export default new Stats();