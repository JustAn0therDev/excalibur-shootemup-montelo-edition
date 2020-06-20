import * as ex from 'excalibur';
import Game from '../game';
import Baddie from '../actors/baddie';

export default class ActorUtils {
    public static collisionEventCameFromBulletOrBaddie(evt: ex.PreCollisionEvent): boolean {
        return evt.other instanceof Baddie 
            || ex.Util.contains(Game.baddieBullets, evt.other);
    }

    public static collistionEventCameFromBaddie(evt: ex.PreCollisionEvent) {
        return evt.other instanceof Baddie;
    }
}