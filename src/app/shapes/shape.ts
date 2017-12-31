import {Point, Color, copyObject, parseColor} from '../commons'

export class Shape {
    static IdSeed:number = 0;

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
    postScaleY: number = 1;

    translation: Point;
    angle: number = 0;
    preMatrix:any;
    visible: boolean = true;

    idNum: string;
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
        this.idNum = (+new Date()) + (++Shape.IdSeed).toString();
    }

    copy():Shape {
        return null;
    }

    copyInto(other: Shape) {
        //other.anchorAt = copyObject(this.anchorAt);
        //other.borderColor = copyObject(this.borderColor);
        //other.fillColor = copyObject(this.fillColor);
        //other.width = this.width;
        //other.height = this.height;
        other.angle = this.angle;
        other.translation.copyFrom(this.translation);
    }

    isWithin(point: Point, margin:number=0) {
        point = this.transformPoint(point);
        return point.x>=-margin && point.x<=this.width+margin &&
               point.y>=-margin && point.y<=this.height+margin;
    }

    getAbsAnchorAt() {
        let absAnchor = this.anchorAt.copy();
        absAnchor.scale(this.postScaleX, this.postScaleY);
        absAnchor.rotateCoordinate(-this.angle);
        absAnchor.scale(this.scaleX, this.scaleY);
        absAnchor.translate(this.translation.x, this.translation.y);
        return absAnchor;
    }

    transformPoint(point:Point) {
        let tPoint = point.copy();
        let absAnchorAt = this.getAbsAnchorAt();
        tPoint.translate(-absAnchorAt.x, -absAnchorAt.y);
        tPoint.scale(1./this.scaleX, 1./this.scaleY);
        tPoint.rotateCoordinate(this.angle);
        tPoint.scale(1./this.postScaleX, 1./this.postScaleY);
        tPoint.translate(this.anchorAt.x, this.anchorAt.y);
        return tPoint;
    }

    reverseTransformPoint(point:Point) {
        let tPoint = point.copy();
        tPoint.translate(-this.anchorAt.x, -this.anchorAt.y);
        tPoint.scale(this.postScaleX, this.postScaleY);
        tPoint.rotateCoordinate(-this.angle);
        tPoint.scale(this.scaleX, this.scaleY);
        let absAnchorAt = this.getAbsAnchorAt();
        tPoint.translate(absAnchorAt.x, absAnchorAt.y);
        return tPoint;
    }

    getAbsReverseTransformPoint(point:Point, rootShape:Shape = null) {
        let tPoint = this.reverseTransformPoint(point);
        if (this.parentShape && this.parentShape != rootShape) {
            tPoint = this.parentShape.getAbsReverseTransformPoint(point, rootShape=rootShape);
        }
        return tPoint;
    }

    getAbsAngle(angle:number) {
        let points = [new Point(0,0), new Point(1, 0)];
        points[1].rotateCoordinate(angle);
        let shape:Shape = this;
        while (shape) {
            points[0] = shape.reverseTransformPoint(points[0]);
            points[1] = shape.reverseTransformPoint(points[1]);
            shape = shape.parentShape;
        }
        let diffPoint = points[1].diff(points[0]);
        return Math.atan2(diffPoint.y, diffPoint.x)*180/Math.PI;
    }

    moveTo(point:Point) {
        let absAnchorAt = this.getAbsAnchorAt();
        let tPoint = point.copy();
        tPoint.translate(-absAnchorAt.x, -absAnchorAt.y)
        this.translation.x += tPoint.x;
        this.translation.y += tPoint.y;
    }

    setHeight(value, fixedAnchor:boolean=true) {
        value = parseFloat(value);
        if (value == 0) {
            value = 0.00001;
        }
        if (value>0) {
            let oldHeight = this.height;
            this.height = value;
            if (fixedAnchor) {
                let absAnchorAt = this.getAbsAnchorAt();
                this.anchorAt.y *= value/oldHeight;
                this.moveTo(absAnchorAt);
            }
        }
    }

    setWidth(value, fixedAnchor:boolean=true) {
        value = parseFloat(value);
        if (value == 0) {
            value = 0.00001;
        }
        if (value>0) {
            let oldWidth = this.width;
            this.width = value;
            if (fixedAnchor) {
                let absAnchorAt = this.getAbsAnchorAt();
                this.anchorAt.x *= value/oldWidth;
                this.moveTo(absAnchorAt);
            }
        }
    }

    setAngle(angle:number) {
        let relLeftTopCorner = new Point(-this.anchorAt.x, -this.anchorAt.y);
        relLeftTopCorner.scale(this.postScaleX, this.postScaleY);
        relLeftTopCorner.rotateCoordinate(-angle);
        relLeftTopCorner.scale(this.scaleX, this.scaleY);
        let absAnchor = this.getAbsAnchorAt();
        relLeftTopCorner.translate(absAnchor.x, absAnchor.y);
        this.angle = angle;
        this.translation.x = relLeftTopCorner.x;
        this.translation.y = relLeftTopCorner.y;
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
