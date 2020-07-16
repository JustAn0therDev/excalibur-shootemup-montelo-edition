import * as ex from 'excalibur';
import Game from '../game';
import Baddie from '../actors/baddie';
import Boss from '../actors/boss';

export function collisionEventCameFromBulletOrBaddie(evt: ex.PreCollisionEvent): boolean {
    return evt.other instanceof Baddie 
    || ex.Util.contains(Game.baddieBullets, evt.other);
}

export function collisionEventCameFromBaddie(evt: ex.PreCollisionEvent): boolean {
    return evt.other instanceof Baddie;
}

export function collisionEventCameFromBulletOrBoss(evt: ex.PreCollisionEvent): boolean {
    return evt.other instanceof Boss || ex.Util.contains(Game.baddieBullets, evt.other);
}