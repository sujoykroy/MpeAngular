import { Shape } from './shape';
import { Polygon } from '../commons';


export class PolygonShape extends Shape {
    static TypeName = "polygon_shape";
    polygons: Polygon[] = [];

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
