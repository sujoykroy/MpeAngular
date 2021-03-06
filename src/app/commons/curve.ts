import { Point } from './point';
import { Rectangle } from './rectangle';

export class BezierPoint {
    constructor (public control1:Point, public control2:Point, public dest:Point) {}

    static createFromJson(jsonData) {
        return new BezierPoint(
                        Point.parse(jsonData.c1),
                        Point.parse(jsonData.c2),
                        Point.parse(jsonData.d)
                );
    }

    toJsonOb() {
        let jsonOb:any = {};
        jsonOb.c1 = this.control1.toText();
        jsonOb.c2 = this.control2.toText();
        jsonOb.d = this.dest.toText();
        return jsonOb;
    }

    copy() {
        return new BezierPoint(this.control1.copy(), this.control2.copy(), this.dest.copy());
    }

    setDest(point:Point) {
        this.dest.copyFrom(point);
    }

    setControl1(point:Point) {
        this.control1.copyFrom(point);
    }

    setControl2(point:Point) {
        this.control2.copyFrom(point);
    }
}

export class Curve {
    static POINT_TYPE_CONTROL_1 = 0
    static POINT_TYPE_CONTROL_2 = 1
    static POINT_TYPE_DEST = 2
    static POINT_TYPE_ORIGIN = 3

    bezierPoints:BezierPoint[];
    closed:boolean = false;
    constructor(public origin:Point) {
        this.bezierPoints = [];
    }

    static createFromJson(jsonData) {
        let curve = new Curve(Point.parse(jsonData.origin));
        for(let bezierPoint of jsonData.bp) {
            curve.bezierPoints.push(BezierPoint.createFromJson(bezierPoint));
        }
        return curve;
    }

    toJsonOb() {
        let jsonOb:any = {};
        jsonOb.origin = this.origin.toText();
        jsonOb.bp = [];
        for(let bezierPoint of this.bezierPoints) {
            jsonOb.bp.push(bezierPoint.toJsonOb());
        }
        return jsonOb;
    }

    copy() {
        let newOb:Curve = new Curve(this.origin.copy());
        for (let bzp of this.bezierPoints){
            newOb.bezierPoints.push(bzp.copy());
        }
        newOb.closed = this.closed;
        return newOb;
    }

    setOrigin(origin:Point) {
        this.origin.copyFrom(origin);
    }

    addBezierPoint(bezierPoint) {
        this.bezierPoints.push(bezierPoint);
    }

    getBezierPointAt(index:number) {
        if(index<0) {
            index += this.bezierPoints.length;
        }
        return this.bezierPoints[index];
    }

    getBoundRect() {
        let rect = new Rectangle(this.origin.copy(), this.origin.copy());
        for (let bzp of this.bezierPoints) {
            rect.expandToInclude(bzp.control1);
            rect.expandToInclude(bzp.control2);
            rect.expandToInclude(bzp.dest);
        }
        return rect;
    }

    translate(dpoint:Point, sign=1) {
        this.origin.translate(sign*dpoint.x, sign*dpoint.y);
        for (let bzp of this.bezierPoints) {
            bzp.dest.translate(sign*dpoint.x, sign*dpoint.y);
            bzp.control1.translate(sign*dpoint.x, sign*dpoint.y);
            bzp.control2.translate(sign*dpoint.x, sign*dpoint.y);
        }
    }

    scale(sx:number, sy:number) {
        this.origin.scale(sx, sy);
        for (let bzp of this.bezierPoints) {
            bzp.dest.scale(sx, sy);
            bzp.control1.scale(sx, sy);
            bzp.control2.scale(sx, sy);
        }
    }

    drawPath(ctx) {
        ctx.moveTo(this.origin.x, this.origin.y);
        for (let bezierPoint of this.bezierPoints) {
            ctx. bezierCurveTo(
                bezierPoint.control1.x, bezierPoint.control1.y,
                bezierPoint.control2.x, bezierPoint.control2.y,
                bezierPoint.dest.x, bezierPoint.dest.y);
        }
    }

    getSVGText(w, h) {
        let ps = [];
        ps.push("M"+ (w*this.origin.x).toString() + " " +
                     (h*this.origin.y).toString());
        for (let bezierPoint of this.bezierPoints) {
            let cs = []
            cs.push((w*bezierPoint.control1.x).toString() + " " +
                    (h*bezierPoint.control1.y).toString());
            cs.push((w*bezierPoint.control2.x).toString() + " " +
                    (h*bezierPoint.control2.y).toString());
            cs.push((w*bezierPoint.dest.x).toString() + " " +
                    (h*bezierPoint.dest.y).toString());
            ps.push("C " + cs.join(", "));
        }
        return ps.join(" ");
    }

    static createOval() {
        let oval = new Curve(new Point(1, 0.5));
        oval.closed = true;
        let k = 0.5522847498*0.5;
        let bezierPoints = [
            new BezierPoint(new Point(1, 0.5+k), new Point(0.5+k, 1), new Point(0.5, 1)),
            new BezierPoint(new Point(0.5-k, 1), new Point(0, 0.5+k), new Point(0, 0.5)),
            new BezierPoint(new Point(0, 0.5-k), new Point(0.5-k, 0), new Point(0.5, 0)),
            new BezierPoint(new Point(0.5+k, 0), new Point(1, 0.5-k), new Point(1, 0.5))
        ];
        for(let bzp of bezierPoints) {
            oval.bezierPoints.push(bzp);
        }
        return oval;
    }
}
