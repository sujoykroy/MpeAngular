import { Shape } from './shape'
import { Color, copyObject, Point } from '../commons'

export class MultiShape extends Shape {
    shapes:Shape[] = []

    static create() {
        return new MultiShape(new Point(0,0), null, null, 1, 1);
    }

    addShape(shape:Shape) {
        this.shapes.push(shape);
    }
}
