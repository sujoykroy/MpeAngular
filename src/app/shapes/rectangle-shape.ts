import { Shape } from './shape'
import { Color, copyObject, Point } from '../commons'
import { drawRoundedRectangle } from '../commons'

export class RectangleShape extends Shape {
    corner: number;

    static create(width:number, height:number,
                  borderColor:any, fillColor:any, radius:number=0) {
        return new RectangleShape(
            new Point(width*0.5, height*0.5),
            borderColor, fillColor, width, height, radius);
    }

    constructor(
        anchorAt:Point, borderColor:Color, fillColor:Color,
        width:number, height: number, corner:number) {
        super(anchorAt, borderColor, fillColor, width, height);
        this.corner = corner;
    }

    drawPath(ctx) {
        drawRoundedRectangle(ctx,
            this.translation.x, this.translation.y,
            this.width, this.height, this.corner);
    }
}
