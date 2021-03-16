import stats from './stats';
import * as ex from 'excalibur';
import Ship from './actors/ship';
import { Actor } from 'excalibur';
import Bullet from './actors/bullet';
import Config, { gameConfig } from './config';
import EnemyFactory from './factories/enemyFactory';
import animManager from './actors/animation-manager';

export default class Game extends ex.Scene {
    baddieBullets: WeakSet<Actor>;
    NumberOfEnemiesOnScreen: number;

    constructor(engine: ex.Engine) {
        super(engine);
        this.baddieBullets = new WeakSet<Actor>();
        this.NumberOfEnemiesOnScreen = 0;
    }

    onInitialize(engine: ex.Engine): void {
        engine.add(animManager);

        const ship = new Ship(engine.halfDrawWidth, 800, 80, 80, this);
        engine.add(ship);

        const scoreLabel = new ex.Label("Score: " + stats.score, 20, 50, 'roboto');
        scoreLabel.color = gameConfig.scoreLabelColor;
        scoreLabel.scale = new ex.Vector(3, 3);
        scoreLabel.on('preupdate', function(this: ex.Label){
            this.text = "Score: " + stats.score;
        });

        engine.add(scoreLabel);

        const gameOverLabel = new ex.Label("Game Over - To play again, refresh your browser!",
                                            engine.halfDrawWidth - 510,
                                            engine.halfDrawHeight, 'roboto');

        gameOverLabel.color = ex.Color.Green;
        gameOverLabel.scale = new ex.Vector(5, 5);

        const enemyTimer: ex.Timer = this.generateEnemyTimer(engine);
        engine.addTimer(enemyTimer);

        engine.on('preupdate', () => {
            if (stats.gameOver) {
                engine.add(gameOverLabel); 
                engine.removeTimer(enemyTimer);
            }
        });
    }

    private generateEnemyTimer(engine: ex.Engine): ex.Timer {
        const intervalToMakeTimerRepeatForever = -1;
        return new ex.Timer(() => {
            const generatedEnemy: ex.Actor | undefined = EnemyFactory.buildEnemy(this);
            if (generatedEnemy) {
                engine.add(generatedEnemy);
                this.NumberOfEnemiesOnScreen++;
            }
        }, Config.spawnTimeInMilisseconds, true, intervalToMakeTimerRepeatForever);
    }

    pushBulletInBulletArray(bullet: Bullet): void {
        this.baddieBullets.add(bullet);
    }

    removeBulletFromBulletArray(bullet: Bullet): void {
        this.baddieBullets.delete(bullet);
    }

    canRenderAnotherEnemyOnScreen(): boolean {
        return this.NumberOfEnemiesOnScreen < Config.limitOfEnemiesOnScreen;
    }

    removeEnemyFromEnemyCounter(): void {
        this.NumberOfEnemiesOnScreen--;
    }
}
