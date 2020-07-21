import Boss from '../actors/boss';
import Baddie from '../actors/baddie';
import Game from '../game';
import Config from '../config';
import enemyFactoryParameter from '../interfaces/parameterObjects/EnemyFactoryParameter';
import { randomIntFromInterval } from '../utils/numberUtils';

export default class EnemyFactory {
     static buildEnemy(): ex.Actor | undefined {
        if (Game.canRenderAnotherEnemyOnScreen()) {
            const dataToCreateEnemy: enemyFactoryParameter = {
                vectorX: Math.random() * 1000,
                vectorY: -100,
                width: 80,
                height: 80
            }
            return this.checkKindOfEnemyThenReturnIt(dataToCreateEnemy);
        }
        return undefined;
    }

    private static checkKindOfEnemyThenReturnIt(dataToCreateNewEnemy: enemyFactoryParameter): 
    ex.Actor 
    {
        if (this.shouldGenerateBoss()) {
            return new Boss(
                dataToCreateNewEnemy.vectorX, 
                dataToCreateNewEnemy.vectorY, 
                dataToCreateNewEnemy.width, 
                dataToCreateNewEnemy.height);
        } 

        return new Baddie(
            dataToCreateNewEnemy.vectorX, 
            dataToCreateNewEnemy.vectorY, 
            dataToCreateNewEnemy.width, 
            dataToCreateNewEnemy.height
        );
    }

    private static shouldGenerateBoss(): boolean {
        return randomIntFromInterval(0, 100) < Config.chancesOfGeneratingBoss;
    }
}