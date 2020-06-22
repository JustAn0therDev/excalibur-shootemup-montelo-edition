import { randomIntFromInterval } from '../utils/numberUtils';
import Boss from '../actors/boss';
import Baddie from '../actors/baddie';

export default class EnemyFactory {
     static buildBaddie() {
        let chancesOfGeneringBoss = 10;
        let vectorX = Math.random() * 1000;
        let vectorY = -100;
        let defaultSize = 80;
        let shouldgenerateBoss: boolean = randomIntFromInterval(1, 100) <= chancesOfGeneringBoss;
        if (shouldgenerateBoss) {
            return new Boss(vectorX, vectorY, defaultSize, defaultSize);
        } else {
            return new Baddie(vectorX, vectorY, defaultSize, defaultSize);
        }
    }
}