import Game from '../game';
import Bullet from "./bullet";
import Config from "../config";
import * as ex from "excalibur";
import AnimationFactory from '../factories/animationFactory';
import { gameSheet, explosionSpriteSheet } from "../resources";
import { checkIfEnemyShouldBeKilledOnCollision } from "../utils/collisionUtils";

export default class Baddie extends ex.Actor {
    private game: Game;
    fireTimer?: ex.Timer;
    explode?: ex.Animation;
    private anim?: ex.Animation;
    hp: number = Config.baddieHp;
    private fireAngle: number = Math.random() * Math.PI * 2;

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
        this.anim = gameSheet.getAnimationByIndices(engine, [10, 11, 12], 100)
        this.anim.scale = new ex.Vector(4, 4);
        this.addDrawing("default", this.anim);

            let animationSpeed = 40;
            let vectorSize = 3;

            this.explode = AnimationFactory.buildAnimation(animationSpeed, 
            explosionSpriteSheet, 
            vectorSize, 
            engine);
            
        this.actions.moveTo(this.pos.x, this.pos.y + 800, Config.enemySpeed)
                    .moveTo(this.pos.x + 800, this.pos.y, Config.enemySpeed)
                    .moveTo(this.pos.x + 800, this.pos.y + 800, Config.enemySpeed)
                    .moveTo(this.pos.x, this.pos.y, Config.enemySpeed)
                    .repeatForever();

        let intervalToMakeTimerRepeatForever = -1;
        this.fireTimer = new ex.Timer(() => { this.fire(engine) }, 
                                            Config.enemyFireIntervalInMilisseconds, 
                                            true, 
                                            intervalToMakeTimerRepeatForever);
        engine.addTimer(this.fireTimer); 
        
    }

    private onPreCollision(evt: ex.PreCollisionEvent): void {
        checkIfEnemyShouldBeKilledOnCollision(this, evt, this.game);
        this.notifyGameClassThisEnemyWasKilled();
    }

    private notifyGameClassThisEnemyWasKilled(): void {
        this.game.NumberOfEnemiesOnScreen--;
    }

    private fire(engine: ex.Engine): void {
        this.fireAngle += Math.PI / 20;
        const bulletVelocity = new ex.Vector(
            Config.enemyBulletVelocity * Math.cos(this.fireAngle),
            Config.enemyBulletVelocity * Math.sin(this.fireAngle)
        );

        const bullet = new Bullet(this.pos.x, this.pos.y, bulletVelocity.x, bulletVelocity.y, this.game, this);
        this.game.pushBulletInBulletArray(bullet);
        engine.add(bullet);
    }
}
