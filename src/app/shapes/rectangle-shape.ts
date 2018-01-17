import { Shape } from './shape'
import { Color, copyObject, Point, SVGNode } from '../commons'
import { drawRoundedRectangle } from '../commons'

export class RectangleShape extends Shape {
    static TypeName = "rectangle";

    cornerRadius: number;

    static create(width:number, height:number,
                  borderColor:any=null, fillColor:any=null, cornerRadius:number=0) {
        return new RectangleShape(
            new Point(width*0.5, height*0.5),
            borderColor, fillColor, width, height, cornerRadius);
    }

    constructor(
        anchorAt:Point, borderColor:any, fillColor:any,
        width:number, height: number, cornerRadius:number) {
        super(anchorAt, borderColor, fillColor, width, height);
        this.cornerRadius = cornerRadius;
    }

    static createFromJson(jsonData) {
        let newOb = new RectangleShape(null, null, null, 0, 0, 0);
        newOb.copyFromJson(jsonData);
        return newOb;
    }

    copyFromJson(jsonData) {
        super.copyFromJson(jsonData);
        this.cornerRadius = parseFloat(jsonData.corner_radius);
    }

    getTypeName() {
        return RectangleShape.TypeName;
    }

    toJsonOb() {
        let jsonOb:any = super.toJsonOb();
        jsonOb.corner_radius = this.cornerRadius
        return jsonOb;
    }

    copy(deepCopy:boolean = false) {
        let newOb = new RectangleShape(
            this.anchorAt, this.borderColor, this.fillColor,
            this.width, this.height, this.cornerRadius);
        this.copyInto(newOb);
        return newOb;
    }

    drawPath(ctx) {
        drawRoundedRectangle(ctx,0, 0, this.width, this.height, this.cornerRadius);
    }

    getSVGNode() {
        let node = super.getSVGNode();
        let rectNode = new SVGNode("rect");
        rectNode.setParam("width", this.width);
        rectNode.setParam("height", this.height);
        node.addChild(rectNode);
        return node;
    }
}
