import * as ex from "excalibur";
import Game from '../game';
import Config from "../config";
import Bullet from "./bullet";
import stats from "../stats";
import ActorUtils from "../utils/actorUtils";
import AnimationFactory from '../factories/animationFactory';
import animManager from "./animation-manager";
import { gameSheet, explosionSpriteSheet } from "../resources";

export default class Boss extends ex.Actor {
    private anim?: ex.Animation;
    private explode?: ex.Animation;
    private explosionFromDamage?: ex.Animation;
    private fireTimer?: ex.Timer;
    private fireAngle: number = Math.random() * Math.PI * 2;
    private hp: number = Config.bossHp;
    
    constructor(x: number, y: number, width: number, height: number) {
        super({
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        });

        this.body.collider.type = ex.CollisionType.Passive;
        this.on('precollision', this.onPreCollision);
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Initialize actor

        // Setup visuals
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

            this.explosionFromDamage = AnimationFactory.buildAnimation(animationSpeed, 
                explosionSpriteSheet, 
                vectorSize, 
                engine);

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

    // Fires before excalibur collision resolution
    private onPreCollision(evt: ex.PreCollisionEvent) {
        if(!ActorUtils.collisionEventCameFromBulletOrBoss(evt)) {
            this.hp--;
            if (this.hp === 0) {
                if (this.explode) {
                    animManager.play(this.explode, this.pos);
                }

                stats.score += Config.scoreGainedFromKillingBoss;

                if (this.fireTimer) {
                    this.fireTimer.cancel();
                }

                this.kill();
            } else {
                if (this.explosionFromDamage) {
                    animManager.play(this.explosionFromDamage, this.pos);
                }
            }
        }
    }

    private fire(engine: ex.Engine) {
        this.fireAngle += Math.PI/20;
        const bulletVelocity = new ex.Vector(
            Config.enemyBulletVelocity * Math.cos(this.fireAngle),
            Config.enemyBulletVelocity * Math.sin(this.fireAngle));

        const bullet = new Bullet(this.pos.x, this.pos.y, bulletVelocity.x, bulletVelocity.y, this);
        Game.pushBulletInBulletArray(bullet);
        engine.add(bullet);
    }
}