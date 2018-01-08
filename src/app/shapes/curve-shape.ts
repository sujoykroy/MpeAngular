import { Shape } from './shape';
import { Curve } from '../commons';

export class CurveShape extends Shape {
    static TypeName = "curve_shape";
    curves:Curve[] = [];

    static createFromJson(jsonData) {
        let newOb = new CurveShape(null, null, null, 0, 0);
        newOb.copyFromJson(jsonData);
        let curves = jsonData.curve;
        if (!(curves instanceof Array)) {
            curves = [curves];
        }
        for (let curve of curves) {
            curve = Curve.createFromJson(curve);
            newOb.curves.push(curve);
        }
        return newOb;
    }

    getTypeName() {
        return CurveShape.TypeName;
    }

    toJsonOb() {
        let jsonOb:any = super.toJsonOb();
        jsonOb.type = "curve_shape";
        jsonOb.curve = [];
        for(let curve of this.curves) {
            jsonOb.curve.push(curve.toJsonOb());
        }
        return jsonOb;
    }

    drawPath(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.scale(this.width, this.height);
        for(let curve of this.curves) {
            curve.drawPath(ctx);
        }
        ctx.restore();
    }
}
