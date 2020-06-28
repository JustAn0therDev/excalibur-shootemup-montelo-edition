import Boss from '../actors/boss';
import Baddie from '../actors/baddie';
import Game from '../game';
import Config from '../config';
import { randomIntFromInterval } from '../utils/numberUtils';

export default class EnemyFactory {
     static buildBaddie(): Baddie | Boss | undefined {
        if (Game.canRenderAnotherEnemyOnScreen()) {
            let vectorX = Math.random() * 1000;
            let vectorY = -100;
            let defaultSize = 80;
            if (this.shouldGenerateBoss()) {
                return new Boss(vectorX, vectorY, defaultSize, defaultSize);
            } else {
                return new Baddie(vectorX, vectorY, defaultSize, defaultSize);
            }
        }
        return undefined;
    }

    private static shouldGenerateBoss(): boolean {
        return randomIntFromInterval(0, 100) < Config.chancesOfGeneratingBoss;
    }
}