import { Shape } from './shape';
import { Polygon, Point, parseColor } from '../commons';


export class PolygonShape extends Shape {
    static TypeName = "polygon_shape";
    polygons: Polygon[];

    constructor(
        anchorAt:Point, borderColor:any, fillColor:any,
        width:number, height: number) {
        super(anchorAt, borderColor, fillColor, width, height);
        this.polygons = [];
    }

    static createFromJson(jsonData) {
        let newOb = new PolygonShape(null, null, null, 0, 0);
        newOb.copyFromJson(jsonData);
        let polygons = jsonData.polygon;
        if (!(polygons instanceof Array)) {
            polygons = [polygons];
        }
        for (let polygon of polygons) {
            polygon = Polygon.createFromJson(polygon);
            newOb.polygons.push(polygon);
        }
        return newOb;
    }

    getTypeName() {
        return PolygonShape.TypeName;
    }

    toJsonOb() {
        let jsonOb:any = super.toJsonOb();
        jsonOb.polygon = [];
        for(let polygon of this.polygons) {
            jsonOb.polygon.push(polygon.toJsonOb());
        }
        return jsonOb;
    }

    copy(deepCopy:boolean = false):Shape {
        let newOb = new PolygonShape(
            this.anchorAt, this.borderColor, this.fillColor,
            this.width, this.height);
        this.copyInto(newOb);
        for(let polygon of this.polygons) {
            newOb.polygons.push(polygon.copy());
        }
        return newOb;
    }

    drawPath(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.scale(this.width, this.height);
        for(let polygon of this.polygons) {
            polygon.drawPath(ctx);
        }
        ctx.restore();
    }
}
