import { Shape } from './shape';
import { Curve, Point, parseColor, Rectangle, SVGNode } from '../commons';

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

    autoFit() {
        let boundRect:Rectangle;
        for(let curve of this.curves) {
            if(!boundRect) {
                boundRect = curve.getBoundRect();
            } else {
                boundRect.expandToIncludeRect(curve.getBoundRect());
            }
        }
        let absAnchorAt:Point = this.getAbsAnchorAt();
        for(let curve of this.curves) {
            curve.translate(boundRect.leftTop, -1);
            curve.scale(1/boundRect.width, 1/boundRect.height);
        }
        this.anchorAt.translate(
                -boundRect.leftTop.x*this.width,
                -boundRect.leftTop.y*this.height);
        this.moveTo(absAnchorAt);
        this.setWidth(boundRect.width*this.width, false);
        this.setHeight(boundRect.height*this.height, false);
    }

    getSVGNode() {
        let node = super.getSVGNode();
        for(let curve of this.curves) {
            let curveNode = new SVGNode("path");
            let points:string[]= [
                "M" + (curve.origin.x*this.width).toFixed(4),
                (curve.origin.y*this.height).toFixed(4).toString()];
            for (let bzp of curve.bezierPoints) {
                points.push("C" + (bzp.control1.x*this.width).toFixed(4));
                points.push((bzp.control1.y*this.height).toFixed(4)+",");

                points.push((bzp.control2.x*this.width).toFixed(4).toString());
                points.push((bzp.control2.y*this.height).toFixed(4) +",");

                points.push((bzp.dest.x*this.width).toFixed(4).toString());
                points.push((bzp.dest.y*this.height).toFixed(4).toString());
            }
            curveNode.setParam("id", this.getSVGIdNum("p"));
            curveNode.setParam("d", points.join(" "));
            curveNode.setStyle("fill-rule", "evenodd");
            node.addChild(curveNode);
        }
        return node;
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
