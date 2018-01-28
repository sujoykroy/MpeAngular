import { CurveShape } from '../shapes';
import { Curve, Point, BezierPoint, Color, parseColor, Rectangle } from '../commons';
import { OvalEditBox } from '../shapes/edit-boxes';

const OVAL_EDIT_BOX_BORDER_COLOR = parseColor("#000000");
const OVAL_EDIT_BOX_FILL_COLOR = parseColor("#FFFFFF");
const CONTROL_EDIT_BOX_FILL_COLOR = parseColor("#FFFF00");

export class CurveShapeCreator {
    curve:Curve;
    curveShape: CurveShape;
    editBoxes:OvalEditBox[];

    constructor() {
        this.curveShape = new CurveShape(new Point(0, 0), "#000000", "#FFFFFF00", 1, 1);
        this.curve = new Curve(new Point(0, 0));
        this.editBoxes = [];
    }

    onMouseDown(mousePos:Point) {
        this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
        if (this.curve.bezierPoints.length==1) {
            this.editBoxes.push(
                new OvalEditBox(
                    this.editBoxes.length.toString(), [0, 0],
                    OVAL_EDIT_BOX_BORDER_COLOR,
                    OVAL_EDIT_BOX_FILL_COLOR, 10)
            );
            this.curve.setOrigin(mousePos);
        } else {
            this.editBoxes.push(
                new OvalEditBox(
                    this.editBoxes.length.toString(), [0, 0],
                    OVAL_EDIT_BOX_BORDER_COLOR,
                    CONTROL_EDIT_BOX_FILL_COLOR, 10)
            );
        }
        this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
    }

    onMouseMove(mousePos:Point, mouseIsDown:boolean) {
        if (mouseIsDown) {
            this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
            if (this.curve.bezierPoints.length == 0) {
                this.curve.origin.copyFrom(mousePos);
            } else {
                let bzp:BezierPoint = this.curve.getBezierPointAt(-1);
                let control2:Point = bzp.dest.diff(mousePos);
                control2.scale(-1, -1);
                bzp.setControl2(control2);
                this.editBoxes[this.editBoxes.length-3].setCenter(control2);
            }
            this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
        } else {
            let bzp:BezierPoint = this.curve.getBezierPointAt(-1);
            let prevPoint:Point;
            if (this.curve.bezierPoints.length == 1) {
                prevPoint = this.curve.origin;
            } else {
                prevPoint = this.curve.getBezierPointAt(-2).dest;
            }
            this.curve.getBezierPointAt(-1);
            bzp.setDest(mousePos);
            bzp.setControl1(prevPoint.getInBetween(bzp.dest, 0.25));
            bzp.setControl2(prevPoint.getInBetween(bzp.dest, 0.75));

            this.editBoxes[this.editBoxes.length-3].setCenter(bzp.dest);
            this.editBoxes[this.editBoxes.length-2].setCenter(bzp.control2);
            this.editBoxes[this.editBoxes.length-1].setCenter(bzp.control1);
        }
    }

    onMouseUp(mousePos:Point) {
        if (this.curve.bezierPoints.length == 0) {
            this.editBoxes.push(
                new OvalEditBox(
                    this.editBoxes.length.toString(), [0, 0],
                    OVAL_EDIT_BOX_BORDER_COLOR,
                    CONTROL_EDIT_BOX_FILL_COLOR, 10)
            );
        }
        this.editBoxes.push(
            new OvalEditBox(
                this.editBoxes.length.toString(), [0, 0],
                OVAL_EDIT_BOX_BORDER_COLOR,
                CONTROL_EDIT_BOX_FILL_COLOR, 10)
        );
        this.editBoxes.push(
            new OvalEditBox(
                this.editBoxes.length.toString(), [0, 0],
                OVAL_EDIT_BOX_BORDER_COLOR,
                OVAL_EDIT_BOX_FILL_COLOR, 10)
        );
        this.editBoxes[this.editBoxes.length-3].setCenter(mousePos);
        this.editBoxes[this.editBoxes.length-2].setCenter(mousePos);
        this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
        this.curve.addBezierPoint(new BezierPoint(
                mousePos.copy(), mousePos.copy(), mousePos.copy()));
    }

    onDoubleClick(mousePos:Point) {
        let prevCount:number = this.curve.bezierPoints.length+1;
        while(prevCount>this.curve.bezierPoints.length && this.curve.bezierPoints.length>1) {
            if (this.curve.getBezierPointAt(-2).dest.distance(this.curve.getBezierPointAt(-1).dest)<10) {
                this.curve.bezierPoints.splice(this.curve.bezierPoints.length-1, 1);
            }
            prevCount -= 1;
        }
        if (this.curve.bezierPoints.length==0) {
            this.curveShape = null;
            return;
        }
        if (this.curve.origin.distance(this.curve.getBezierPointAt(-1).dest)<10) {
            this.curve.bezierPoints.splice(this.curve.bezierPoints.length-1, 1);
            this.curve.closed = true;
        }
        let rect:Rectangle = this.curve.getBoundRect();
        this.curve.translate(rect.leftTop, -1);
        this.curve.scale(1/rect.width, 1/rect.height);
        this.curveShape.curves.push(this.curve)
        this.curveShape.setWidth(rect.width);
        this.curveShape.setHeight(rect.height);
        this.curveShape.setAnchorAt(new Point(rect.width*0.5, rect.height*0.5));
        this.curveShape.moveTo(new Point(rect.centerX, rect.centerY));
    }

    getFinishedShape() {
        return this.curveShape;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        this.curve.drawPath(ctx);
        ctx.restore();
        this.curveShape.drawBorder(ctx);
        for(let editBox of this.editBoxes) {
            ctx.save();
            editBox.drawPath(ctx, 0);
            ctx.restore();
            editBox.drawFill(ctx);

            ctx.save();
            editBox.drawPath(ctx, 0);
            ctx.restore();
            editBox.drawBorder(ctx);
        }
    }
}
