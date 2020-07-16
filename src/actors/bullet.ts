import * as ex from "excalibur";
import Game from '../game';
import Config from "../config";
import { gameSheet } from "../resources";

export default class Bullet extends ex.Actor {
    owner?: ex.Actor;
    constructor(x: number, y: number, dx: number, dy: number, owner?: ex.Actor) {
        super({
            pos: new ex.Vector(x, y),
            vel: new ex.Vector(dx, dy),
            width: Config.bulletSize,
            height: Config.bulletSize,
        });
        this.body.collider.type = ex.CollisionType.Passive;
        this.owner = owner;
    }
    
    onInitialize(engine: ex.Engine): void {
        this.on('precollision', this.onPreCollision);

        // If the bullet exists the viewport,
        // remove it from the bullet array in the Game class.
        this.on('exitviewport', () => this.killAndRemoveFromBullets());

        const anim = gameSheet.getAnimationByIndices(engine, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
        anim.scale = new ex.Vector(2, 2);
        this.addDrawing('default', anim);
    }

    private onPreCollision(evt: ex.PreCollisionEvent): void {
        if (!(evt.other instanceof Bullet) && 
            evt.other !== this.owner) {
            this.killAndRemoveFromBullets();
        }
    }

    private killAndRemoveFromBullets(): void {
        this.kill();
        ex.Util.removeItemFromArray(this, Game.baddieBullets);
    }
}