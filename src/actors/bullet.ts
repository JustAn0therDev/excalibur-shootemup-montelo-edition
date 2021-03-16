import Game from '../game';
import Config from "../config";
import * as ex from "excalibur";
import { gameSheet } from "../resources";

export default class Bullet extends ex.Actor {
    private game: Game;
    owner?: ex.Actor;
    constructor(x: number, y: number, dx: number, dy: number, game: Game, owner?: ex.Actor) {
        super({
            pos: new ex.Vector(x, y),
            vel: new ex.Vector(dx, dy),
            width: Config.bulletSize,
            height: Config.bulletSize,
        });
        this.body.collider.type = ex.CollisionType.Passive;
        this.owner = owner;
        this.game = game;
    }
    
    onInitialize(engine: ex.Engine): void {
        const anim = gameSheet.getAnimationByIndices(engine, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
        anim.scale = new ex.Vector(2, 2);
        this.addDrawing('default', anim);

        this.on('precollision', this.onPreCollision);
        this.on('exitviewport', () => this.killAndRemoveFromBullets());
    }

    private onPreCollision(evt: ex.PreCollisionEvent): void {
        if (!(evt.other instanceof Bullet) && evt.other !== this.owner) {
            this.killAndRemoveFromBullets();
        }
    }

    private killAndRemoveFromBullets(): void {
        this.kill();
        this.game.removeBulletFromBulletArray(this);
    }
}