import Config from "./config";

class Stats {
    hp: number = Config.totalHp;
    gameOver = false;
    score = 0;
}

export default new Stats();