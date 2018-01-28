import { Point } from './point';
import { Rectangle } from './rectangle';

export class Polygon {
    points: Point[];
    closed = false;

    constructor() {
        this.points = [];
    }

    static createFromJson(jsonData) {
        let polygon = new Polygon();
        for (let point of jsonData.point) {
            point = Point.createFromJson(point);
            polygon.points.push(point);
        }
        polygon.closed = (jsonData.closed != "False");
        return polygon;
    }

    copy() {
        let newOb:Polygon = new Polygon();
        for (let point of this.points){
            newOb.points.push(point.copy());
        }
        newOb.closed = this.closed;
        return newOb;
    }

    addPoint(point:Point) {
        this.points.push(point);
    }

    translate(dpoint:Point, sign=1) {
        for(let point of this.points) {
            point.translate(sign*dpoint.x, sign*dpoint.y);
        }
    }

    scale(sx:number, sy:number) {
        for(let point of this.points) {
            point.scale(sx, sy);
        }
    }

    getPointAt(index:number) {
        if (index<0) {
            index += this.points.length;
        }
        return this.points[index];
    }

    getBoundRect() {
        let rect = new Rectangle(this.points[0].copy(), this.points[0].copy());
        for (let point of this.points) {
            rect.expandToInclude(point);
        }
        return rect;
    }

    toJsonOb() {
        let jsonOb:any = {};
        jsonOb.point = [];
        for(let point of this.points) {
            jsonOb.point.push(point.toJsonOb());
        }
        return jsonOb;
    }

    drawPath(ctx) {
        for (let pi=0; pi<this.points.length; pi++) {
            let point = this.points[pi];
            if (pi == 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        if (this.closed) {
            ctx.lineTo(this.points[0].x, this.points[0].y);
        }
    }
}
