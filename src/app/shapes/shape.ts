import {Point, Color, copyObject, parseColor, extendCtx, Rectangle } from '../commons'
import { PointShapeProp, FloatShapeProp, ColorShapeProp } from './shape-props';
import { SVGNode } from '../commons/svg-node';

export class Shape {

    static MOVE_TYPE_RESIZE = 1;
    static MOVE_TYPE_XY = 2;
    static MOVE_TYPE_ROTATE = 3;
    static MOVE_TYPE_ANCHOR = 4;

    static IdSeed:number = 0;

    static ShapeProps = [
        new PointShapeProp("xy"),
        new PointShapeProp("anchorAt"),
        new FloatShapeProp("width"),
        new FloatShapeProp("height"),
        new FloatShapeProp("angle"),
        new ColorShapeProp("fillColor"),
        new ColorShapeProp("borderColor"),
        new FloatShapeProp("borderWidth"),
    ]

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

    getTypeName() {
        return "shape";
    }

    getShapeProps() {
        return Shape.ShapeProps;
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

        this.renderable = !(jsonData.renderable == "0");
    }

    toJsonOb() {
        let jsonOb:any = { type: this.getTypeName() };
        jsonOb.anchor_at = this.anchorAt.toText();
        jsonOb.translation = this.translation.toText();
        if(this.borderColor) {
            jsonOb.border_color = this.borderColor.toText();
        }
        jsonOb.border_width = this.borderWidth;
        if(this.fillColor) {
            jsonOb.fill_color = this.fillColor.toText();
        }
        jsonOb.width = this.width;
        jsonOb.height = this.height;
        jsonOb.angle = this.angle;
        jsonOb.post_scale_x = this.postScaleX;
        jsonOb.post_scale_y = this.postScaleY;
        jsonOb.scale_x = this.scaleX;
        jsonOb.scale_y = this.scaleY;
        if (!this.renderable) {
            jsonOb.renderable = "0";
        }
        return jsonOb;
    }

    setPropValue(propName, propValue, propData, raw=false) {
        if (!raw) {
            let setterName = "set" +
                             propName.substr(0,1).toUpperCase() +
                             propName.substr(1);
            if (setterName in this) {
                this[setterName](propValue, propData);
                return;
            }
        }
        this[propName] = propValue;
    }

    getPropValue(propName) {
        let getterName = "get" +
                         propName.substr(0,1).toUpperCase() +
                         propName.substr(1);
        if (getterName in this) {
            return this[getterName]();
        }
        return this[propName];
    }

    getXy() {
        let point:Point = this.getAbsAnchorAt();
        if (this.parentShape) {
            point.subtract(this.parentShape.anchorAt);
        }
        return point;
    }

    setXy(point) {
        if (this.parentShape) {
            point = point.copy();
            point.add(this.parentShape.anchorAt);
        }
        this.moveTo(point);
    }

    setAnchorAt(point) {
        this.anchorAt.copyFrom(point);
    }

    getAnchorAt(point) {
        return this.anchorAt.copy();
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

    getAncestors():Shape[] {
        let shapes:Shape[] = [];
        let shape:Shape = this;
        while (shape) {
            shape = shape.parentShape;
            if (shape) {
                shapes.splice(0, 0, shape);
            }
        }
        return shapes;
    }

    getAbsTransformPoint(point:Point, rootShape:Shape = null) {
        for(let shape of this.getAncestors()) {
            point = shape.transformPoint(point);
        }
        return this.transformPoint(point);
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

    getSVGIdNum(prefix:string="g") {
        return prefix + this.idNum;
    }

    getSVGNode() {
        let node = new SVGNode("g");
        node.setParam("id", this.getSVGIdNum());
        node.transform(this.translation, this.angle);

        if (this.borderColor) {
            node.setParam("stroke", this.borderColor.toHtml());
            node.setParam("stroke-width", this.borderWidth);
        }
        if (this.fillColor) {
            node.setParam("fill", this.fillColor.toHtml());
        }
        return node;
    }

    createShapeParamValue(shapeId, propName, value) {
        let paramValue:any = {};
        paramValue[propName] = value;
        let shapeParamValue:any = {}
        shapeParamValue[shapeId] = paramValue;
        return shapeParamValue;
    }

    getSVGAnimValue(propName, value) {
        return this.createShapeParamValue(this.getSVGIdNum(), propName, value);
    }

    autoFit() {}

    getBoundRect():Rectangle {
        let leftTop:Point = this.translation.copy();
        let rightBottom:Point = leftTop.copy();
        rightBottom.translate(this.width, this.height)
        return new Rectangle(leftTop, rightBottom);
    }

    getAbsBoundRect():Rectangle {
        let points:Point[] = [
            new Point(0, 0),
            new Point(this.width, 0),
            new Point(this.width, this.height),
            new Point(0, this.height)
        ];
        let rect:Rectangle;
        for (let point of points) {
            point = this.reverseTransformPoint(point);
            if (!rect) {
                rect = new Rectangle(point.copy(), point.copy());
            } else {
                rect.expandToInclude(point);
            }
        }
        return rect;
    }
}
