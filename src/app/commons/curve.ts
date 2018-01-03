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

    drawPath(ctx) {
        ctx.moveTo(this.origin.x, this.origin.y);
        for (let bezierPoint of this.bezierPoints) {
            ctx. bezierCurveTo(
                bezierPoint.control1.x, bezierPoint.control1.y,
                bezierPoint.control2.x, bezierPoint.control2.y,
                bezierPoint.dest.x, bezierPoint.dest.y);
        }
    }
}
