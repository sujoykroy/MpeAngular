import {Point, Color, copyObject, parseColor} from '../commons'

export class Shape {
    anchorAt:Point;
    width: number;
    height: number;
    borderWidth:number = 2;
    borderColor: Color;
    fillColor: Color;

    scaleX: number = 1;
    scaleY: number = 1;
    sameScaleXY: boolean = false;
    postScaleX: number = 1;
    postScaleY: number = 0;

    translation: Point;
    angle: number = 0;
    preMatrix:any;
    visible: boolean = true;

    idNum: number;
    parentShape: Shape;

    constructor(
        anchorAt:Point, borderColor:any, fillColor:any,
        width:number, height: number) {
        this.anchorAt = copyObject(anchorAt);
        this.borderColor = parseColor(borderColor);
        this.fillColor = parseColor(fillColor);
        this.width = width;
        this.height = height;
        this.translation = new Point(0, 0);
    }

    getAbsAnchorAt() {
        let absAnchor = this.anchorAt.copy();
        absAnchor.scale(this.postScaleX, this.postScaleY);
        absAnchor.rotateCoordinate(-this.angle);
        absAnchor.scale(this.scaleX, this.scaleY);
        absAnchor.translate(this.translation.x, this.translation.y);
        return absAnchor;
    }

    moveTo(x:number, y: number) {
        let point = new Point(x,y);
        let absAnchorAt = this.getAbsAnchorAt();
        point.translate(-absAnchorAt.x, -absAnchorAt.y)
        this.translation.x += point.x;
        this.translation.y += point.y;
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
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor.getStyleValue();
        ctx.stroke();
    }

    drawFill(ctx) {
        if (!this.fillColor) return;
        ctx.fillStyle = this.fillColor.getStyleValue();
        ctx.fill();
    }

    hasBorder() {
        return !!this.borderColor;
    }

    hasFill() {
        return !!this.fillColor;
    }

    drawPath(ctx) {}
}
