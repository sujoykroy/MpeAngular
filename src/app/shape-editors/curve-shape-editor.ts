import { Point, parseColor, Curve, drawStroke, BezierPoint } from '../commons';
import { CurveShape } from '../shapes';
import { OvalEditBox } from '../shapes/edit-boxes';

const LINE_COLOR = parseColor("#000000");

class PointEditBox extends OvalEditBox {
    prevControlBox:PointEditBox;
    postControlBox:PointEditBox;

    constructor(public curveIndex:number,
			    public bezierPointIndex:number,
			    public pointType:number,
			    public curvePoint: Point,
			    public curveShape:CurveShape) {
        super("", [0, 0],
                CurveShape.OVAL_EDIT_BOX_BORDER_COLOR,
                CurveShape.OVAL_EDIT_BOX_FILL_COLOR, 10);
        if (this.pointType == Curve.POINT_TYPE_CONTROL_1 ||
            this.pointType == Curve.POINT_TYPE_CONTROL_2) {
            this.setFillColor(CurveShape.CONTROL_EDIT_BOX_FILL_COLOR);
        }
        this.updateCenter();
    }

    updateCenter() {
        let point = new Point(
                this.curvePoint.x*this.curveShape.width,
                this.curvePoint.y*this.curveShape.height);
        this.center.copyFrom(this.curveShape.getAbsReverseTransformPoint(point));
    }

    setCenter(center:Point) {
        this.center.copyFrom(center);
        let point = this.curveShape.getAbsTransformPoint(center);
        this.curvePoint.x = point.x/this.curveShape.width;
        this.curvePoint.y = point.y/this.curveShape.height;
    }
}

export class CurveShapeEditor {
    editBoxes: PointEditBox[];
    selectedBox:PointEditBox;
    initCenter:Point;

    constructor(private curveShape:CurveShape) {
        this.initCenter = new Point(0, 0);
        this.editBoxes = [];
        this.buildEditBoxes();
    }

    buildEditBoxes() {
        this.editBoxes.length = 0;
        for (let curve_i=0; curve_i<this.curveShape.curves.length; curve_i++) {
            let curve:Curve = this.curveShape.curves[curve_i];
            this.editBoxes.push(new PointEditBox(
                    curve_i, -1,
                    Curve.POINT_TYPE_ORIGIN, curve.origin, this.curveShape));
            for (let bzp_i=0; bzp_i<curve.bezierPoints.length; bzp_i++) {
                let bzp:BezierPoint = curve.bezierPoints[bzp_i];
                this.editBoxes.push(new PointEditBox(
	                curve_i, bzp_i,
	                Curve.POINT_TYPE_CONTROL_1, bzp.control1, this.curveShape));
                if (this.editBoxes.length>4) {
                    this.editBoxes[this.editBoxes.length-2].postControlBox =
                        this.editBoxes[this.editBoxes.length-1];
                }
                this.editBoxes.push(new PointEditBox(
                    curve_i, bzp_i,
                    Curve.POINT_TYPE_CONTROL_2, bzp.control2, this.curveShape));
                this.editBoxes.push(new PointEditBox(
                    curve_i, bzp_i,
                    Curve.POINT_TYPE_DEST, bzp.dest, this.curveShape));

                this.editBoxes[this.editBoxes.length-1].prevControlBox =
                        this.editBoxes[this.editBoxes.length-2];
            }
        }
    }

    repositionBoxes() {
        for(let editBox of this.editBoxes) {
            editBox.updateCenter();
        }
    }

    selectItemAt(point:Point) {
        let foundBox:PointEditBox = null;
        for(let editBox of this.editBoxes) {
            if (editBox.isWithin(point)) {
                foundBox = editBox;
                break;
            }
        }
        this.selectedBox = foundBox;
        if (this.selectedBox) {
            this.initCenter.copyFrom(this.selectedBox.center);
        }
        return !!this.selectedBox;
    }

    moveActiveItem(startPoint:Point, endPoint:Point) {
        if (!this.selectedBox) return null;
        let center = endPoint.diff(startPoint);
        center.translate(this.initCenter.x, this.initCenter.y);

        if (this.selectedBox.prevControlBox) {
            let prevControl:Point =
                this.selectedBox.prevControlBox.center.diff(this.selectedBox.center);
            prevControl.add(center);
            this.selectedBox.prevControlBox.setCenter(prevControl);
        }
        if (this.selectedBox.postControlBox) {
            let postControl:Point =
                this.selectedBox.postControlBox.center.diff(this.selectedBox.center);
            postControl.add(center);
            this.selectedBox.postControlBox.setCenter(postControl);
        }
        this.selectedBox.setCenter(center);
    }

    draw(ctx) {
        ctx.beginPath();
        for(let i =1; i<this.editBoxes.length; i+=3) {
            ctx.moveTo(this.editBoxes[i-1].center.x, this.editBoxes[i-1].center.y);
            ctx.lineTo(this.editBoxes[i].center.x, this.editBoxes[i].center.y);

            ctx.moveTo(this.editBoxes[i+1].center.x, this.editBoxes[i+1].center.y);
            ctx.lineTo(this.editBoxes[i+2].center.x, this.editBoxes[i+2].center.y);
        }
        drawStroke(ctx, LINE_COLOR, 1);

        for(let editBox of this.editBoxes) {
            ctx.save();
            editBox.drawPath(ctx);
            ctx.restore();
            editBox.drawFill(ctx);

            ctx.save();
            editBox.drawPath(ctx);
            ctx.restore();
            editBox.drawBorder(ctx);
        }
    }
}
