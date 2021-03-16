import stats from "../stats";
import config from '../config';
import Boss from "../actors/boss";
import Baddie from "../actors/baddie";
import animManager from "../actors/animation-manager";
import { collisionEventCameFromBoss, collisionEventCameFromPlayerShipsBullet } from "./actorUtils";

export function checkIfEnemyShouldBeKilledOnCollision(enemy: Baddie | Boss, colEvt: ex.PreCollisionEvent): void {
    let collidedWithSomething = false;

    console.log(`COLLISION LOG: ENEMY GOT SHOT BY SHIP: ${collisionEventCameFromPlayerShipsBullet(colEvt)}`);

    if (enemy instanceof Baddie) {
        collidedWithSomething = collisionEventCameFromBoss(colEvt) || collisionEventCameFromPlayerShipsBullet(colEvt);
    } else {
        collidedWithSomething = collisionEventCameFromPlayerShipsBullet(colEvt);
    }

    if (collidedWithSomething) {
        enemy.hp--;
        if (enemy.hp <= 0) {
            if (enemy.explode) {
                animManager.play(enemy.explode, enemy.pos);
            }
            stats.score += config.scoreGainedFromKillingBoss;

            if (enemy.fireTimer) {
                enemy.fireTimer.cancel();
            }
            enemy.kill();
        }
    }
}