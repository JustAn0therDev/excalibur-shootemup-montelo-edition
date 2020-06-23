import * as ex from "excalibur";
import ActorUtils from "../utils/actorUtils";
import { gameSheet } from "../resources";

export class Missile extends ex.Actor {
    constructor() {
        super({
            pos: ex.Vector.Zero,
            width: 60,
            height: 20
        });

        this.on('precollision', this.onPreCollision);
        this.on('exitviewport', () => {
            this.kill();
        });
    }
    
    onPreCollision(evt: ex.PreCollisionEvent): void {
        if(!ActorUtils.collisionEventCameFromBaddie(evt)) {
            this.kill();
         }
    }

    onInitialize(engine: ex.Engine): void {
        const animation = gameSheet.getAnimationByIndices(engine, [13, 14, 15], 50);
        animation.scale = new ex.Vector(3, 3);
    }
}