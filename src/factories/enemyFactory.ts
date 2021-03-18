import Game from '../game';
import Config from '../config';
import Boss from '../actors/boss';
import Baddie from '../actors/baddie';
import { randomIntFromInterval } from '../utils/numberUtils';
import enemyFactoryParameter from '../interfaces/parameterObjects/EnemyFactoryParameter';

export default class EnemyFactory {
    static buildEnemy(game:Game): ex.Actor {
        const dataToCreateEnemy: enemyFactoryParameter = {
            vectorX: Math.random() * 1000,
            vectorY: -100,
            width: 80,
            height: 80
        }

        return this.checkKindOfEnemyThenReturnIt(dataToCreateEnemy, game);
    }

    private static checkKindOfEnemyThenReturnIt(dataToCreateNewEnemy: enemyFactoryParameter, game: Game): ex.Actor 
    {
        if (this.shouldGenerateBoss()) {
            return new Boss(
                dataToCreateNewEnemy.vectorX, 
                dataToCreateNewEnemy.vectorY, 
                dataToCreateNewEnemy.width, 
                dataToCreateNewEnemy.height, 
                game);
        } 

        return new Baddie(
            dataToCreateNewEnemy.vectorX, 
            dataToCreateNewEnemy.vectorY, 
            dataToCreateNewEnemy.width, 
            dataToCreateNewEnemy.height,
            game
        );
    }

    private static shouldGenerateBoss(): boolean {
        return randomIntFromInterval(0, 100) < Config.chancesOfGeneratingBoss;
    }
}
