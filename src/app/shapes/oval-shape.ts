import { Shape } from './shape';
import { Curve, SVGNode } from '../commons';

export class OvalShape extends Shape {
    static TypeName = "oval";
    static OvalCurve = Curve.createOval();

    static createFromJson(jsonData) {
        let newOb = new OvalShape(null, null, null, 0, 0);
        newOb.copyFromJson(jsonData);
        return newOb;
    }

    getTypeName() {
        return OvalShape.TypeName;
    }

    copy(deepCopy:boolean = false) {
        let newOb = new OvalShape(
            this.anchorAt, this.borderColor, this.fillColor,
            this.width, this.height);
        this.copyInto(newOb);
        return newOb;
    }

    drawPath(ctx) {
        ctx.beginPath();
        ctx.save()
        ctx.scale(this.width, this.height);
        OvalShape.OvalCurve.drawPath(ctx);
        ctx.restore();
    }

    getSVGNode() {
        let node = super.getSVGNode();
        let circleNode = new SVGNode("path");
        circleNode.setParam("d",
            OvalShape.OvalCurve.getSVGText(this.width, this.height));
        node.addChild(circleNode);
        return node;
    }
}
