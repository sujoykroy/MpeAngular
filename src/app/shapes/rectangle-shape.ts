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

    copy() {
        let newOb = new RectangleShape(
            this.anchorAt, this.borderColor, this.fillColor,
            this.width, this.height, this.corner);
        this.copyInto(newOb);
        return newOb;
    }

    drawPath(ctx) {
        drawRoundedRectangle(ctx,0, 0, this.width, this.height, this.corner);
    }
}
