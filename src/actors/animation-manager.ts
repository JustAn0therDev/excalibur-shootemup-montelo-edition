import * as ex from "excalibur";
import AnimationNode from '../interfaces/animationNode';

class AnimationManager extends ex.Actor {
    private animationNodes: Array<AnimationNode> = new Array<AnimationNode>();
    constructor() {
        super({
            pos: ex.Vector.Zero,
            width: 0,
            height: 0,
            collisionType: ex.CollisionType.PreventCollision,
        });
        this.traits.length = 0;
    }

    play(animation: ex.Animation, pos: ex.Vector): void {
        this.animationNodes.push({
            anim: animation,
            pos: pos.clone()
        });
    }

    onPostUpdate(): void {
        this.animationNodes = this.animationNodes
        .filter(animationNode => !animationNode.anim.isDone());
    }

    onPostDraw(ctx: CanvasRenderingContext2D): void {
        for (let animationNode of this.animationNodes) {
            animationNode.anim.draw(
                ctx, 
                animationNode.pos.x - animationNode.anim.drawWidth / 2, 
                animationNode.pos.y - animationNode.anim.drawHeight / 2
            );
        }
    }
}

export default new AnimationManager();