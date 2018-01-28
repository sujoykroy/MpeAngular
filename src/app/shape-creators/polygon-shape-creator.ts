import { PolygonShape } from '../shapes';
import { Polygon, Point, Color, parseColor, Rectangle } from '../commons';
import { OvalEditBox } from '../shapes/edit-boxes';

const OVAL_EDIT_BOX_BORDER_COLOR = parseColor("#000000");
const OVAL_EDIT_BOX_FILL_COLOR = parseColor("#FFFFFF");

export class PolygonShapeCreator {
    polygon:Polygon;
    polygonShape: PolygonShape;
    editBoxes:OvalEditBox[];

    constructor() {
        this.polygonShape = new PolygonShape(new Point(0, 0), "#000000", "#FFFFFF00", 1, 1);
        this.polygon = new Polygon();
        this.editBoxes = [];
    }

    onMouseDown(mousePos:Point) {
        this.editBoxes.push(
            new OvalEditBox(
                this.editBoxes.length.toString(), [0, 0],
                OVAL_EDIT_BOX_BORDER_COLOR,
                OVAL_EDIT_BOX_FILL_COLOR, 10)
        );
        this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
        this.polygon.addPoint(mousePos.copy());
        if (this.polygon.points.length==1) {
            this.polygon.addPoint(mousePos.copy());
        }
    }

    onMouseMove(mousePos:Point, mouseIsDown:boolean) {
        this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
        this.polygon.getPointAt(-1).copyFrom(mousePos);
    }

    onMouseUp(mousePos:Point) {
    }

    onDoubleClick(mousePos:Point) {
        let prevCount:number = this.polygon.points.length+1;
        while(prevCount>this.polygon.points.length && this.polygon.points.length>1) {
            if (this.polygon.getPointAt(-2).distance(this.polygon.getPointAt(-1))<10) {
                this.polygon.points.splice(this.polygon.points.length-1, 1);
            }
            prevCount -= 1;
        }
        if (this.polygon.points.length<=1) {
            this.polygonShape = null;
            return;
        }
        if (this.polygon.points.length>2) {
            if (this.polygon.getPointAt(0).distance(this.polygon.getPointAt(-1))<10) {
                this.polygon.points.splice(this.polygon.points.length-1, 1);
                this.polygon.closed = true;
            }
        }
        let rect:Rectangle = this.polygon.getBoundRect();
        this.polygon.translate(rect.leftTop, -1);
        this.polygon.scale(1/rect.width, 1/rect.height);
        this.polygonShape.polygons.push(this.polygon)
        this.polygonShape.setWidth(rect.width);
        this.polygonShape.setHeight(rect.height);
        this.polygonShape.setAnchorAt(new Point(rect.width*0.5, rect.height*0.5));
        this.polygonShape.moveTo(new Point(rect.centerX, rect.centerY));
    }

    getFinishedShape() {
        return this.polygonShape;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        this.polygon.drawPath(ctx);
        ctx.restore();
        this.polygonShape.drawBorder(ctx);
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
