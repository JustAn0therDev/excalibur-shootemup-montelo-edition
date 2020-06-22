import * as ex from 'excalibur';

export default class AnimationFactory { 
    public static buildAnimation(animationSpeed: number,
                                spriteSheet: ex.SpriteSheet, 
                                vectorSize: number, 
                                engine: ex.Engine,
                                shouldLoopAnimation?: boolean) : ex.Animation 
    {
        let animationObjectToReturn: ex.Animation = spriteSheet.getAnimationForAll(engine, animationSpeed);
        animationObjectToReturn.scale = new ex.Vector(vectorSize, vectorSize);
        animationObjectToReturn.loop = shouldLoopAnimation ? shouldLoopAnimation : false;
        return animationObjectToReturn;
    }
}