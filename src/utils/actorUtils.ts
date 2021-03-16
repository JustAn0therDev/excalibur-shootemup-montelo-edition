import Ship from '../actors/ship';
import Boss from '../actors/boss';
import Baddie from '../actors/baddie';
import Bullet from '../actors/bullet';
import { Actor, PreCollisionEvent } from 'excalibur';

export function collisionEventCameFromPlayerShipsBullet(evt: PreCollisionEvent<Actor>): boolean {
    return evt.other instanceof Bullet && evt.actor instanceof Ship;
}

export function collisionEventCameFromBullet(evt: ex.PreCollisionEvent<Actor>): boolean {
    return evt.other instanceof Bullet;
}

export function collisionEventCameFromBaddieOrBossBullet(evt: PreCollisionEvent<Actor>) {
    // the bullet must have been shot by a baddie or a boss. If the player shot the bullet, it does not count.
    return evt.other instanceof Bullet && evt.actor instanceof Baddie || evt.actor instanceof Boss;    
}

export function collisionEventCameFromBaddie(evt: ex.PreCollisionEvent<Actor>): boolean {
    return evt.other instanceof Baddie;
}

export function collisionEventCameFromBoss(evt: ex.PreCollisionEvent<Actor>): boolean {
    return evt.other instanceof Boss;
}