import Game from "../game";
import stats from "../stats";
import Bullet from "./bullet";
import Config from "../config";
import * as ex from "excalibur";
import animManager from "./animation-manager";
import { FireFunction } from '../types/FireFunction';
import AnimationFactory from '../factories/animationFactory';
import { gameSheet, explosionSpriteSheet } from "../resources";
import { collisionEventCameFromBaddie, collisionEventCameFromBaddieOrBossBullet, collisionEventCameFromBoss } from "../utils/actorUtils";

const throttle = function(this: any, func: FireFunction, throttle: number): FireFunction {
    var lastTime = Date.now();
    var throttle = throttle;
    return (engine: ex.Engine) => {
       var currentTime = Date.now();
       if (currentTime - lastTime > throttle) {
          var callableFunction = func.apply(this, [engine]);
          lastTime = currentTime;
          return callableFunction;
        }
    }
}

export default class Ship extends ex.Actor {
    private flipBarrel = false;
    private throttleFire?: FireFunction;
    private explode?: ex.Animation;
    private keyboardControlsMap?: Map<number, (dir: ex.Vector) => number>;
    private game: Game;
    constructor(x: number, y: number, width: number, height: number, game: Game) {
        super({
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        });
        this.body.collider.type = ex.CollisionType.Passive;
        this.game = game;
    }

    onInitialize(engine: ex.Engine): void {
        const anim = gameSheet.getAnimationByIndices(engine, [0, 1, 2], 100);
        const animationSpeed = 80;
        const vectorSize = 2;

        anim.scale = new ex.Vector(3, 3);
        this.addDrawing("default", anim);

        this.throttleFire = throttle(this.fire, Config.playerFireThrottle);
        this.initializeControlMap();
        this.on('precollision', this.onPreCollision);

        engine.input.keyboard.on('hold', (evt) => this.handleKeyEvent(engine, evt));
        engine.input.keyboard.on('release', (evt: ex.Input.KeyEvent) => { 
            if(evt.key !== ex.Input.Keys.Space) {
                this.vel = ex.Vector.Zero.clone()
            }
         });

        this.explode = AnimationFactory.buildAnimation(animationSpeed,
            explosionSpriteSheet,
            vectorSize,
            engine);
    }

    private initializeControlMap() {
        this.keyboardControlsMap = new Map<number, (dir: ex.Vector) => number>()
        .set(ex.Input.Keys.W, (dir) => dir.y--)
        .set(ex.Input.Keys.A, (dir) => dir.x--)
        .set(ex.Input.Keys.D, (dir) => dir.x++)
        .set(ex.Input.Keys.S, (dir) => dir.y++)
    }

    onPreCollision(evt: ex.PreCollisionEvent): void {
        const collidedWithEnemyBulletOrBody = 
            collisionEventCameFromBaddieOrBossBullet(evt, this.game) || collisionEventCameFromBaddie(evt) || collisionEventCameFromBoss(evt);

        if (collidedWithEnemyBulletOrBody) {
            this.actions.blink(300, 300, 3);
            stats.hp -= Config.enemyDamage;
            if (stats.hp <= 0) {
                stats.gameOver = true;
                if (this.explode) {
                    animManager.play(this.explode, this.pos);
                }
                this.kill();
                this.stopRegisteringFireInput();
            }
         }
    }

    private stopRegisteringFireInput(): void {
        this.throttleFire = undefined;
    }

    onPostUpdate(engine: ex.Engine): void {
       // Keep player in the viewport where the ship can still be seen on screen
       if(this.pos.x < 0) this.pos.x = 0;
       if(this.pos.y < 0) this.pos.y = 0;
       if(this.pos.x > engine.drawWidth - this.width) this.pos.x = (engine.drawWidth - this.width);
       if(this.pos.y > engine.drawHeight - this.height) this.pos.y = (engine.drawHeight - this.height);
    }

    private fire = (engine: ex.Engine): void => {
        const bullet = new Bullet(this.pos.x + (this.flipBarrel?-40:40), this.pos.y - 20, 0, Config.playerBulletVelocity, this.game, this);
        this.flipBarrel = !this.flipBarrel;
        engine.add(bullet);
    }

    handleKeyEvent = (engine: ex.Engine, evt: ex.Input.KeyEvent): void => {
        const dir = ex.Vector.Zero.clone();
        this.keyboardControlsMap?.get(evt.key)?.call(this, dir);

        this.handleSpaceKeyEvent(evt, engine, dir);
        this.configShipSpeed(dir);
    }

    private handleSpaceKeyEvent(evt: ex.Input.KeyEvent, engine: ex.Engine, dir: ex.Vector): void {
        if (evt.key === ex.Input.Keys.Space) {
            this.checkIfHasToThrottleFire(engine, evt);
            this.checkIfShouldNormalizeVectorVelocity(dir);
        }
    }

    private checkIfHasToThrottleFire(engine: ex.Engine, evt: ex.Input.KeyEvent): void {
        this.throttleFire ? this.throttleFire(engine) : null;
    }

    private checkIfShouldNormalizeVectorVelocity(dir: ex.Vector): void {
        if (this.vel.x !== 0 || this.vel.y !== 0) 
            dir = this.vel.normalize();
    }

    private configShipSpeed(dir: ex.Vector): void {
        if (dir.x !== 0 || dir.y !== 0)
            this.vel = dir.normalize().scale(Config.playerSpeed);
    }
}
