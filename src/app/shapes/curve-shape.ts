import { Shape } from './shape';
import { Curve } from '../commons';

export class CurveShape extends Shape {
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
        console.log(newOb);
        return newOb;
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
