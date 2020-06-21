import * as ex from "excalibur";
import { Sounds, gameSheet } from "../resources";
import ActorUtils from "../utils/actorUtils";

export class Missile extends ex.Actor {
    constructor() {
        super({
            pos: ex.Vector.Zero,
            width: 60,
            height: 20
        });

        this.on('precollision', this.onPreCollision);
        this.on('exitviewport', () => {
            Sounds.rocketSound.stop();
            this.kill();
        });
    }
    
    onPreCollision(evt: ex.PreCollisionEvent) {
        if(ActorUtils.collisionEventCameFromBaddie(evt)){
            Sounds.rocketSound.stop();
            Sounds.explodeSound.play();
            this.kill();
         }
    }

    onInitialize(engine: ex.Engine) {
        const animation = gameSheet.getAnimationByIndices(engine, [13, 14, 15], 50);
        animation.scale = new ex.Vector(3, 3);
    }
}