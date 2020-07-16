import Boss from "../actors/boss";
import Baddie from "../actors/baddie";
import animManager from "../actors/animation-manager";
import stats from "../stats";
import config from '../config';
import { collisionEventCameFromBulletOrBoss } from "./actorUtils";

export function checkIfEnemyShouldBeKilledOnCollision(
    enemy: Baddie | Boss, collisionEvent: ex.PreCollisionEvent): void {
    if(!collisionEventCameFromBulletOrBoss(collisionEvent)) {
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