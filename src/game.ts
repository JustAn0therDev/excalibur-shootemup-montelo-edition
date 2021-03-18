import stats from './stats';
import * as ex from 'excalibur';
import Ship from './actors/ship';
import { Actor } from 'excalibur';
import Bullet from './actors/bullet';
import Config, { gameConfig } from './config';
import EnemyFactory from './factories/enemyFactory';
import animManager from './actors/animation-manager';

export default class Game extends ex.Scene {
    BaddieBullets: WeakSet<Actor>;
    NumberOfEnemiesOnScreen: number;

    constructor(engine:ex.Engine) {
        super(engine);
        this.BaddieBullets = new WeakSet<Actor>();
        this.NumberOfEnemiesOnScreen = 0;
    }

    onInitialize(engine:ex.Engine): void {
        engine.add(animManager);

        const ship = new Ship(engine.halfDrawWidth, 800, 80, 80, this);
        engine.add(ship);

        const scoreLabel = new ex.Label("Score: " + stats.score, 20, 50, 'Consolas');
        scoreLabel.color = gameConfig.scoreLabelColor;
        scoreLabel.scale = new ex.Vector(3, 3);
        scoreLabel.on('preupdate', function(this:ex.Label){
            this.text = "Score: " + stats.score;
        });

        engine.add(scoreLabel);

        const gameOverLabel = new ex.Label("Game Over!",
                                            engine.halfDrawWidth - 80,
                                            engine.halfDrawHeight, 'Consolas');

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
        return new ex.Timer(() => {
            if (this.canRenderAnotherEnemyOnScreen()) {
                engine.add(EnemyFactory.buildEnemy(this));
                this.NumberOfEnemiesOnScreen++;
            }
        }, Config.spawnTimeInMilisseconds, true, Config.intervalToMakeTimerRepeatForever);
    }

    pushBulletInBulletArray(bullet: Bullet): void {
        this.BaddieBullets.add(bullet);
    }

    removeBulletFromBulletArray(bullet: Bullet): void {
        this.BaddieBullets.delete(bullet);
    }

    canRenderAnotherEnemyOnScreen(): boolean {
        return this.NumberOfEnemiesOnScreen < Config.limitOfEnemiesOnScreen;
    }
}
