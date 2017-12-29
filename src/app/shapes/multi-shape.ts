import { Shape } from './shape'
import { Color, copyObject, Point } from '../commons'

export class MultiShape extends Shape {
    shapes:Shape[] = []

    static create():MultiShape {
        return new MultiShape(new Point(0,0), null, null, 1, 1);
    }

    addShape(shape:Shape) {
        this.shapes.push(shape);
    }

    draw(ctx) {
        for(let shape of this.shapes) {
            ctx.save();
            shape.preDraw(ctx);
            if (shape.hasFill()) {
                shape.drawPath(ctx);
                shape.drawFill(ctx);
            }
            if (shape.hasBorder()) {
                shape.drawPath(ctx);
                shape.drawBorder(ctx);
            }
            ctx.restore();
        }
    }
}
