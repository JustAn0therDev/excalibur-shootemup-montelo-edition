import * as ex from "excalibur";
import Game from '../game';
import Config from "../config";
import Bullet from "./bullet";
import AnimationFactory from '../factories/animationFactory';
import { checkIfEnemyShouldBeKilledOnCollision } from '../utils/collisionUtils';
import { gameSheet, explosionSpriteSheet } from "../resources";

export default class Boss extends ex.Actor {
    private anim?: ex.Animation;
    private fireAngle: number = Math.random() * Math.PI * 2;
    explode?: ex.Animation;
    hp: number = Config.bossHp;
    fireTimer?: ex.Timer;
    private game: Game;
    
    constructor(x: number, y: number, width: number, height: number, game: Game) {
        super({
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        });

        this.body.collider.type = ex.CollisionType.Passive;
        this.on('precollision', this.onPreCollision);
        this.game = game;
    }

    onInitialize(engine: ex.Engine): void {
        // Initialize actor

        this.anim = gameSheet.getAnimationByIndices(engine, [10, 11, 12], 100)
        this.anim.scale = new ex.Vector(8, 8);
        this.addDrawing("default", this.anim);

            let animationSpeed = 80, vectorSize = 7;

            this.explode = AnimationFactory.buildAnimation(animationSpeed, 
                explosionSpriteSheet, 
                vectorSize, 
                engine);

            animationSpeed = 100;
            vectorSize = 1;

        // Setup patrolling behavior
        this.actions.moveTo(this.pos.x, this.pos.y + 800, Config.enemySpeed)
                    .moveTo(this.pos.x + 800, this.pos.y, Config.enemySpeed)
                    .moveTo(this.pos.x + 800, this.pos.y + 800, Config.enemySpeed)
                    .moveTo(this.pos.x, this.pos.y, Config.enemySpeed)
                    .repeatForever();

        let intervalToMakeTimerRepeatForever = -1;
        this.fireTimer = new ex.Timer(() => { this.fire(engine) }, 
                                            Config.bossFireIntervalInMilisseconds, 
                                            true, 
                                            intervalToMakeTimerRepeatForever);

        engine.addTimer(this.fireTimer);
    }

    private onPreCollision(evt: ex.PreCollisionEvent): void {
        checkIfEnemyShouldBeKilledOnCollision(this, evt);
        this.notifyGameClassThisEnemyWasKilled();
    }

    private notifyGameClassThisEnemyWasKilled(): void {
        this.game.removeEnemyFromEnemyCounter();
    }

    private fire(engine: ex.Engine): void {
        this.fireAngle += Math.PI/20;
        const bulletVelocity = new ex.Vector(
            Config.enemyBulletVelocity * Math.cos(this.fireAngle),
            Config.enemyBulletVelocity * Math.sin(this.fireAngle));

        const bullet = new Bullet(this.pos.x, this.pos.y, bulletVelocity.x, bulletVelocity.y, this.game);
        this.game.pushBulletInBulletArray(bullet);
        engine.add(bullet);
    }
}