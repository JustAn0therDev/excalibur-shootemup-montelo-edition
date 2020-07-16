import Boss from '../actors/boss';
import Baddie from '../actors/baddie';
import Game from '../game';
import Config from '../config';
import { randomIntFromInterval } from '../utils/numberUtils';
import enemyFactoryParameter from '../interfaces/parameterObjects/EnemyFactoryParameter';

export default class EnemyFactory {
     static buildEnemy(): Baddie | Boss | undefined {
        if (Game.canRenderAnotherEnemyOnScreen()) {
            let defaultSize = 80;
            const dataToCreateEnemy: enemyFactoryParameter = {
                vectorX: Math.random() * 1000,
                vectorY: -100,
                width: defaultSize,
                height: defaultSize
            }
            return this.checkKindOfEnemyThenReturnIt(dataToCreateEnemy);
        }
        return undefined;
    }

    private static checkKindOfEnemyThenReturnIt(dataToCreateNewEnemy: enemyFactoryParameter ):
    Baddie | Boss {
        if (this.shouldGenerateBoss()) {
            return new Boss(
                dataToCreateNewEnemy.vectorX, 
                dataToCreateNewEnemy.vectorY, 
                dataToCreateNewEnemy.width, 
                dataToCreateNewEnemy.height);
        } else {
            return new Baddie(
                dataToCreateNewEnemy.vectorX, 
                dataToCreateNewEnemy.vectorY, 
                dataToCreateNewEnemy.width, 
                dataToCreateNewEnemy.height
            );
        }
    }

    private static shouldGenerateBoss(): boolean {
        return randomIntFromInterval(0, 100) < Config.chancesOfGeneratingBoss;
    }
}