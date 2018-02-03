import { CurveShape } from '../shapes';
import { Curve, Point, BezierPoint, Color, parseColor, Rectangle } from '../commons';
import { OvalEditBox } from '../shapes/edit-boxes';

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
        if (this.curve.bezierPoints.length>0) {
            this.editBoxes.push(
                new OvalEditBox(
                    this.editBoxes.length.toString(), [0, 0],
                    CurveShape.OVAL_EDIT_BOX_BORDER_COLOR,
                    CurveShape.CONTROL_EDIT_BOX_FILL_COLOR, 10)
            );
        } else {
            this.editBoxes.push(
                new OvalEditBox(
                    this.editBoxes.length.toString(), [0, 0],
                    CurveShape.OVAL_EDIT_BOX_BORDER_COLOR,
                    CurveShape.OVAL_EDIT_BOX_FILL_COLOR, 10)
            );
            this.curve.setOrigin(mousePos);
        }
        this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
    }

    onMouseMove(mousePos:Point, mouseIsDown:boolean) {
        if (mouseIsDown) {
            if (this.curve.bezierPoints.length == 0) {
                this.curve.origin.copyFrom(mousePos);
            } else {
                let bzp:BezierPoint = this.curve.getBezierPointAt(-1);
                let control2:Point = mousePos.diff(bzp.dest)
                control2.scale(-1, -1);
                control2.translate(bzp.dest.x, bzp.dest.y);

                let prevDestPoint:Point;
                if (this.curve.bezierPoints.length==1) {
                    prevDestPoint = this.curve.origin.copy();
                } else {
                    prevDestPoint = this.curve.getBezierPointAt(-2).dest;
                }
                let control1:Point = prevDestPoint.getInBetween(
                    control2, bzp.control1.distance(prevDestPoint)/prevDestPoint.distance(control2))

                bzp.setControl1(control1);
                bzp.setControl2(control2);

                this.editBoxes[this.editBoxes.length-4].setCenter(control1);
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
            bzp.setDest(mousePos);
            bzp.setControl1(prevPoint.getInBetween(bzp.dest, 0.25));
            bzp.setControl2(prevPoint.getInBetween(bzp.dest, 0.75));

            this.editBoxes[this.editBoxes.length-3].setCenter(bzp.control1);
            this.editBoxes[this.editBoxes.length-2].setCenter(bzp.control2);
            this.editBoxes[this.editBoxes.length-1].setCenter(bzp.dest);
        }
    }

    onMouseUp(mousePos:Point) {
        if (this.curve.bezierPoints.length == 0) {
            this.editBoxes.push(
                new OvalEditBox(
                    this.editBoxes.length.toString(), [0, 0],
                    CurveShape.OVAL_EDIT_BOX_BORDER_COLOR,
                    CurveShape.CONTROL_EDIT_BOX_FILL_COLOR, 10)
            );
        }
        this.editBoxes.push(
            new OvalEditBox(
                this.editBoxes.length.toString(), [0, 0],
                CurveShape.OVAL_EDIT_BOX_BORDER_COLOR,
                CurveShape.CONTROL_EDIT_BOX_FILL_COLOR, 10)
        );
        this.editBoxes.push(
            new OvalEditBox(
                this.editBoxes.length.toString(), [0, 0],
                CurveShape.OVAL_EDIT_BOX_BORDER_COLOR,
                CurveShape.OVAL_EDIT_BOX_FILL_COLOR, 10)
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

        let lastDestPoint:Point = this.curve.origin;
        ctx.beginPath();
        for(let bzp of this.curve.bezierPoints) {
            ctx.moveTo(lastDestPoint.x, lastDestPoint.y);
            ctx.lineTo(bzp.control1.x, bzp.control1.y);

            ctx.moveTo(bzp.dest.x, bzp.dest.y);
            ctx.lineTo(bzp.control2.x, bzp.control2.y);
            lastDestPoint = bzp.dest;
        }
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
