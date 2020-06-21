import * as ex from 'excalibur';

export default class AnimationUtils { 
    public static configureAnimation(animationSpeed: number,
                                spriteSheet: ex.SpriteSheet, 
                                vectorSize: number, 
                                engine: ex.Engine,
                                shouldLoopAnimation: boolean = false) : ex.Animation 
    {
        let animationObjectToReturn: ex.Animation = spriteSheet.getAnimationForAll(engine, animationSpeed);
        animationObjectToReturn.scale = new ex.Vector(vectorSize, vectorSize);
        animationObjectToReturn.loop = shouldLoopAnimation;
        return animationObjectToReturn;
    }
}