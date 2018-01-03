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
    name: string;
    parentShape: Shape;
    renderable = true;

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

    copy(deepCopy:boolean = false):Shape {
        return null;
    }

    copyInto(other: Shape) {
        other.name = this.name;
        other.angle = this.angle;
        other.translation.copyFrom(this.translation);
    }

    copyFromJson(jsonData) {
        this.name = jsonData.name;
        this.anchorAt = Point.parse(jsonData.anchor_at);
        this.translation = Point.parse(jsonData.translation);

        this.borderColor = parseColor(jsonData.border_color);
        this.borderWidth = parseFloat(jsonData.border_width);
        this.fillColor = parseColor(jsonData.fill_color);

        this.width = parseFloat(jsonData.width);
        this.height = parseFloat(jsonData.height);
        this.angle = parseFloat(jsonData.angle);

        this.postScaleX = parseFloat(jsonData.post_scale_x);
        this.postScaleY = parseFloat(jsonData.post_scale_y);

        this.scaleX = parseFloat(jsonData.scale_x);
        this.scaleY = parseFloat(jsonData.scale_y);
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
        point = point.copy();
        let absAnchorAt = this.getAbsAnchorAt();
        point.translate(-absAnchorAt.x, -absAnchorAt.y);
        point.scale(1./this.scaleX, 1./this.scaleY);
        point.rotateCoordinate(this.angle);
        point.scale(1./this.postScaleX, 1./this.postScaleY);
        point.translate(this.anchorAt.x, this.anchorAt.y);
        return point;
    }

    reverseTransformPoint(point:Point) {
        point = point.copy();
        point.translate(-this.anchorAt.x, -this.anchorAt.y);
        point.scale(this.postScaleX, this.postScaleY);
        point.rotateCoordinate(-this.angle);
        point.scale(this.scaleX, this.scaleY);
        let absAnchorAt = this.getAbsAnchorAt();
        point.translate(absAnchorAt.x, absAnchorAt.y);
        return point;
    }

    getAbsReverseTransformPoint(point:Point, rootShape:Shape = null) {
        point = this.reverseTransformPoint(point);
        if (this.parentShape && this.parentShape != rootShape) {
            point = this.parentShape.getAbsReverseTransformPoint(point, rootShape=rootShape);
        }
        return point;
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
        point = point.copy();
        point.translate(-absAnchorAt.x, -absAnchorAt.y)
        this.translation.x += point.x;
        this.translation.y += point.y;
    }

    setParentShape(shape:Shape) {
        this.parentShape = shape;
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
        ctx.rotate(this.angle*Math.PI/180);
        ctx.scale(this.postScaleX, this.postScaleY)
    }

    drawBorder(ctx) {
        if (!this.borderColor) return;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor.getStyleValue();
        ctx.stroke();
    }

    drawFill(ctx) {
        if (!this.fillColor) return;
        ctx.mozFillRule = 'evenodd';
        ctx.fillStyle = this.fillColor.getStyleValue();
        ctx.fill("evenodd");
    }

    hasBorder() {
        return !!this.borderColor;
    }

    hasFill() {
        return !!this.fillColor;
    }

    drawPath(ctx) {}

}
