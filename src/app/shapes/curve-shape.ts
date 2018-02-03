import { Shape } from './shape';
import { Curve, Point, parseColor } from '../commons';

export class CurveShape extends Shape {
    static OVAL_EDIT_BOX_BORDER_COLOR = parseColor("#000000");
    static OVAL_EDIT_BOX_FILL_COLOR = parseColor("#FFFFFF");
    static CONTROL_EDIT_BOX_FILL_COLOR = parseColor("#FFFF00");


    static TypeName = "curve_shape";
    curves:Curve[];

    constructor(
        anchorAt:Point, borderColor:any, fillColor:any,
        width:number, height: number) {
        super(anchorAt, borderColor, fillColor, width, height);
        this.curves = [];
    }

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

    copy(deepCopy:boolean = false):Shape {
        let newOb = new CurveShape(
            this.anchorAt, this.borderColor, this.fillColor,
            this.width, this.height);
        this.copyInto(newOb);
        for(let curve of this.curves) {
            newOb.curves.push(curve.copy());
        }
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
