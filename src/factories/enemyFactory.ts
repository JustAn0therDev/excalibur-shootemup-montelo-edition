import Boss from '../actors/boss';
import Baddie from '../actors/baddie';
import { randomIntFromInterval } from '../utils/numberUtils';

export default class EnemyFactory {
     static buildBaddie() {
        let chancesOfGeneringBoss = 10;
        let vectorX = Math.random() * 1000;
        let vectorY = -100;
        let defaultSize = 80;
        if (EnemyFactory.shouldGenerateBoss(chancesOfGeneringBoss)) {
            return new Boss(vectorX, vectorY, defaultSize, defaultSize);
        } else {
            return new Baddie(vectorX, vectorY, defaultSize, defaultSize);
        }
    }

    static shouldGenerateBoss(chancesOfGeneratingBoss: number) {
        return randomIntFromInterval(0, 100) < chancesOfGeneratingBoss;
    }
}