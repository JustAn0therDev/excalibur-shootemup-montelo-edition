import Config from "./config";

class Stats {
    hp: number = Config.totalHp;
    gameOver: boolean = false;
    score: number = 0;
}

export default new Stats();