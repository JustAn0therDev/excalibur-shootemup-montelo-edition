import * as ex from 'excalibur';
import Game from '../game';
import Baddie from '../actors/baddie';
import Boss from '../actors/boss';

export default class ActorUtils {
    public static collisionEventCameFromBulletOrBaddie(evt: ex.PreCollisionEvent): boolean {
        return evt.other instanceof Baddie 
            || ex.Util.contains(Game.baddieBullets, evt.other);
    }

    public static collisionEventCameFromBaddie(evt: ex.PreCollisionEvent): boolean {
        return evt.other instanceof Baddie;
    }

    public static collisionEventCameFromBulletOrBoss(evt: ex.PreCollisionEvent): boolean {
        return evt.other instanceof Boss || ex.Util.contains(Game.baddieBullets, evt.other);
    }
}