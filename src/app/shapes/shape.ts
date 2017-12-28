import {Point, Color, copyObject} from '../commons'

export class Shape {
    anchorAt:Point;
    width: number;
    height: number;
    borderColor: Color;
    fillColor: Color;

    scaleX: number;
    scaleY: number;
    sameScaleXY: boolean;
    postScaleX: number;
    postScaleY: number;

    translation: Point;
    angle: number;
    preMatrix:any;
    visible: boolean;

    idNum: number;
    parentShape: Shape;

    constructor(
        anchorAt:Point, borderColor:Color, fillColor:Color,
        width:number, height: number) {
        this.anchorAt = copyObject(anchorAt);
        this.borderColor = copyObject(borderColor);
        this.fillColor = copyObject(fillColor);
        this.width = width;
        this.height = height;
    }

    preDraw(ctx, rootShape = null) {
        if (this.parentShape) {
            this.parentShape.preDraw(ctx);
        }
        ctx.translate(this.translation.x, this.translation.y);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.rotate(this.angle*Math.PI/180)
    }

    drawBorder(ctx) {
        if (!this.borderColor) return;
        ctx.strokeStyle = this.borderColor.getStyleValue();
        ctx.stroke();
    }

    drawFill(ctx) {
        if (!this.fillColor) return;
        ctx.fillStyle = this.fillColor.getStyleValue();
        ctx.fill();
    }
}
