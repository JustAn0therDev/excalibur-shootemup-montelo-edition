import * as ex from 'excalibur';
import stats from './stats';
import Bullet from './actors/bullet';
import Config from './config';
import EnemyFactory from './factories/enemyFactory';
import animManager from './actors/animation-manager';
import Ship from './actors/ship';
import Boss from './actors/boss';
import Baddie from './actors/baddie';

export default class Game extends ex.Scene {
    static baddieBullets: Array<Bullet> = new Array<Bullet>();
    private static _enemiesOnScreenCounter: number = 0;

    constructor(engine: ex.Engine) {
        super(engine);
    }

    onInitialize(engine: ex.Engine): void {
        engine.add(animManager);

        const ship = new Ship(engine.halfDrawWidth, 800, 80, 80);
        engine.add(ship);

        const scoreLabel = new ex.Label("Score: " + stats.score, 20, 50);
        scoreLabel.color = ex.Color.Azure;
        scoreLabel.scale = new ex.Vector(3, 3);
        scoreLabel.on('preupdate', function(this: ex.Label){
            this.text = "Score: " + stats.score;
        });

        engine.add(scoreLabel);

        const gameOverLabel = new ex.Label("Game Over - To play again, refresh your browser!",
                                            engine.halfDrawWidth - 510,
                                            engine.halfDrawHeight, 'roboto');

        gameOverLabel.color = ex.Color.Green.clone();
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
        let intervalToMakeTimerRepeatForever = -1;
        return new ex.Timer(() => {
            const generatedEnemy: Baddie | Boss | undefined = EnemyFactory.buildBaddie();
            if (generatedEnemy) {
                engine.add(generatedEnemy);
                Game._enemiesOnScreenCounter++;
            }
        }, Config.spawnTimeInMilisseconds, true, intervalToMakeTimerRepeatForever);
    }

    static pushBulletInBulletArray(bullet: Bullet): void {
        Game.baddieBullets.push(bullet);
    }

    static removeBulletFromBulletArray(bullet: Bullet): void {
        ex.Util.removeItemFromArray(bullet, Game.baddieBullets);
    }

    static canRenderAnotherEnemyOnScreen(): boolean {
        return Game._enemiesOnScreenCounter < 5;
    }

    static removeEnemyFromEnemiesOnScreenCounter(): void {
        this._enemiesOnScreenCounter--;
    }
}