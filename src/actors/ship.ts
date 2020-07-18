import * as ex from "excalibur";
import Config from "../config";
import Bullet from "./bullet";
import { collisionEventCameFromBulletOrBaddie } from "../utils/actorUtils";
import AnimationFactory from '../factories/animationFactory';
import stats from "../stats";
import animManager from "./animation-manager";
import { FireFunction } from '../types/FireFunction';
import { gameSheet, explosionSpriteSheet } from "../resources";

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
    private controlMap?: Map<number, (dir: ex.Vector) => number>;
    constructor(x: number, y: number, width: number, height: number) {
        super({
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        });
        this.body.collider.type = ex.CollisionType.Passive;
    }

    onInitialize(engine: ex.Engine): void {
        this.throttleFire = throttle(this.fire, Config.playerFireThrottle);
        this.initializeControlMap();
        this.on('precollision', this.onPreCollision);

        engine.input.keyboard.on('hold', (evt) => this.handleKeyEvent(engine, evt));
        engine.input.keyboard.on('release', (evt: ex.Input.KeyEvent) => { 
            if(evt.key !== ex.Input.Keys.Space) {
                this.vel = ex.Vector.Zero.clone()
            }
         });

        const anim = gameSheet.getAnimationByIndices(engine, [0, 1, 2], 100);
        anim.scale = new ex.Vector(3, 3);
        this.addDrawing("default", anim);

        let animationSpeed = 80;
        let vectorSize = 2;

        this.explode = AnimationFactory.buildAnimation(animationSpeed,
            explosionSpriteSheet,
            vectorSize,
            engine);
    }

    private initializeControlMap() {
        this.controlMap = new Map<number, (dir: ex.Vector) => number>()
        .set(87, (dir) => dir.y--)
        .set(65, (dir) => dir.x--)
        .set(68, (dir) => dir.x++)
        .set(83, (dir) => dir.y++)
    }

    onPreCollision(evt: ex.PreCollisionEvent): void {
        if(collisionEventCameFromBulletOrBaddie(evt)){
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
       // Keep player in the viewport
       if(this.pos.x < 0) this.pos.x = 0;
       if(this.pos.y < 0) this.pos.y = 0;
       if(this.pos.x > engine.drawWidth - this.width) this.pos.x = (engine.drawWidth - this.width);
       if(this.pos.y > engine.drawHeight - this.height) this.pos.y = (engine.drawHeight - this.height);
    }

    private fire = (engine: ex.Engine): void => {
        const bullet = new Bullet(this.pos.x + (this.flipBarrel?-40:40), this.pos.y - 20, 0, Config.playerBulletVelocity, this);
        this.flipBarrel = !this.flipBarrel;
        engine.add(bullet);
    }

    handleKeyEvent = (engine: ex.Engine, evt: ex.Input.KeyEvent): void => {
        let dir = ex.Vector.Zero.clone();
        
        this.controlMap?.get(evt.key)?.call(this, dir);

        if (evt.key === ex.Input.Keys.Space) {
            this.throttleFire ? this.throttleFire(engine) : null;
            if (this.vel.x !== 0 || this.vel.y !== 0) {
                dir = this.vel.normalize();
            }
        }

        if (dir.x !== 0 || dir.y !== 0) 
            this.vel = dir.normalize().scale(Config.playerSpeed);
    }
}