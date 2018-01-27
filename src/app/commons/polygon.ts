import { Point } from './point';

export class Polygon {
    points: Point[] = [];
    closed = false;

    static createFromJson(jsonData) {
        let polygon = new Polygon();
        for (let point of jsonData.point) {
            point = Point.createFromJson(point);
            polygon.points.push(point);
        }
        polygon.closed = (jsonData.closed != "False");
        return polygon;
    }

    addPoint(point:Point) {
        this.points.push(point);
    }

    getPointAt(index:number) {
        if (index<0) {
            index += this.points.length;
        }
        return this.points[index];
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
