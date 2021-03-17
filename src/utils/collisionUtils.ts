import stats from "../stats";
import config from '../config';
import Boss from "../actors/boss";
import Baddie from "../actors/baddie";
import { PreCollisionEvent } from 'excalibur';
import animManager from "../actors/animation-manager";
import { collisionEventCameFromPlayerShipsBullet } from "./actorUtils";

// Apparently, an actor is always listening to events, the problem is having a bunch of enemies at the same time
// on the screen, resulting in: "amountOfEvents * numberOfEnemies"
export function checkIfEnemyShouldBeKilledOnCollision(enemy: Baddie | Boss, evt: PreCollisionEvent): void {
    let collided = collisionEventCameFromPlayerShipsBullet(evt);
    console.log(`Enemy collided with something that is not a baddie nor a boss: ${collided}`);

    if (collided) {
        enemy.hp--;
        if (enemy.hp <= 0) {
            if (enemy.explode) 
                animManager.play(enemy.explode, enemy.pos);
            
            stats.score += enemy instanceof Baddie ? config.scoreGainedFromKillingBaddie : config.scoreGainedFromKillingBoss;

            if (enemy.fireTimer)
                enemy.fireTimer.cancel();
            
            enemy.kill();
        }
    }
}
