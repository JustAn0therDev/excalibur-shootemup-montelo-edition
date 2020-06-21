import * as ex from 'excalibur';
import { Ship } from './actors/ship';

import stats from './stats';
import Baddie from './actors/baddie';
import Boss from './actors/boss';
import Bullet from './actors/bullet';
import Config from './config';

import { animManager } from './actors/animation-manager';
import { randomIntFromInterval } from './utils/numberUtils';

export default class Game extends ex.Scene {
    public static baddieBullets: Array<Bullet> = new Array<Bullet>();
    private CHANCES_OF_GENERATING_BOSS = 10;

    constructor(engine: ex.Engine) {
        super(engine);
    }

    onInitialize(engine: ex.Engine) {
        engine.add(animManager);

        const ship = new Ship(engine.halfDrawWidth, 800, 80, 80);
        engine.add(ship);

        const scoreLabel = new ex.Label("Score: " + stats.score, 20, 50);
        scoreLabel.color = ex.Color.Azure;
        scoreLabel.scale = new ex.Vector(3, 3);
        scoreLabel.on('preupdate', function(this: ex.Label, evt){
            this.text = "Score: " + stats.score;
        });
        engine.add(scoreLabel);

        const gameOverLabel = new ex.Label("Game Over",
                                            engine.halfDrawWidth - 250,
                                            engine.halfDrawHeight);

        gameOverLabel.color = ex.Color.Green.clone();
        gameOverLabel.scale = new ex.Vector(8,8);
        gameOverLabel.actions
        .blink(1000, 1000, 400)
        .repeatForever();

        const instructionsLabel = new ex.Label("To play again, refresh your browser!",
                                                engine.halfDrawWidth - 350, 
                                                engine.halfDrawHeight + 200)
        instructionsLabel.color = ex.Color.Green.clone();
        instructionsLabel.scale = new ex.Vector(4,4);

        const enemyTimer = this.generateEnemyTimer(engine);

        engine.addTimer(enemyTimer);

        engine.on('preupdate', () => {
            if (stats.gameOver) {
                engine.add(gameOverLabel); 
                engine.add(instructionsLabel);
                engine.removeTimer(enemyTimer);
            }
        });
    }

    private generateEnemyTimer(engine: ex.Engine): ex.Timer {
        const enemyTimer: ex.Timer = new ex.Timer(() => {
            let vectorX = Math.random() * 1000;
            let vectorY = -100;
            let defaultSize = 80;
            let shouldgenerateBoss: boolean = randomIntFromInterval(1, 100) <= this.CHANCES_OF_GENERATING_BOSS;

            if (shouldgenerateBoss) {
                engine.add(new Boss(vectorX, vectorY, defaultSize, defaultSize));
            } else {
                engine.add(new Baddie(vectorX, vectorY, defaultSize, defaultSize));
            }

        }, Config.spawnTimeInMilisseconds, true, -1);

        return enemyTimer;
    }
}