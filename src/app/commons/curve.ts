import { Point } from './point';

class BezierPoint {
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
}

export class Curve {
    bezierPoints:BezierPoint[] = [];
    closed:boolean = false;
    constructor(public origin:Point) {}

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
