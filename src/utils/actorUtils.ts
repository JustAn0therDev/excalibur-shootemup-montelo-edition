import Game from '../game';
import Ship from '../actors/ship';
import Boss from '../actors/boss';
import Baddie from '../actors/baddie';
import Bullet from '../actors/bullet';
import { Actor, PreCollisionEvent, Util } from 'excalibur';

// other is the bullet; the actor on which the event was thrown
// "actor" is the actor which RECEIVED the event; might be the actual "target" actor
export function collisionEventCameFromPlayerShipsBullet(evt:PreCollisionEvent<Actor>, game:Game): boolean {
    return evt.other instanceof Bullet && !game.BaddieBullets.has(evt.other);
}

export function collisionEventCameFromBaddieOrBossBullet(evt:PreCollisionEvent<Actor>, game:Game) {
    return evt.other instanceof Bullet && game.BaddieBullets.has(evt.other);    
}

export function collisionEventCameFromBaddie(evt:ex.PreCollisionEvent<Actor>): boolean {
    return evt.other instanceof Baddie;
}

export function collisionEventCameFromBoss(evt:ex.PreCollisionEvent<Actor>): boolean {
    return evt.other instanceof Boss;
}
