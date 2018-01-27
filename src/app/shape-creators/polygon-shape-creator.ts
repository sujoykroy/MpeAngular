import { PolygonShape } from '../shapes';
import { Polygon, Point, Color, parseColor } from '../commons';
import { OvalEditBox } from '../shapes/edit-boxes';

const OVAL_EDIT_BOX_BORDER_COLOR = parseColor("#000000");
const OVAL_EDIT_BOX_FILL_COLOR = parseColor("#FFFFFF");

export class PolygonShapeCreator {
    polygon:Polygon;
    polygonShape: PolygonShape;
    editBoxes:OvalEditBox[];

    constructor() {
        this.polygonShape = new PolygonShape(new Point(0, 0), "#000000", null, 1, 1);
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
        this.polygon.addPoint(mousePos.copy());
    }

    onMouseMove(mousePos:Point) {
        this.editBoxes[this.editBoxes.length-1].setCenter(mousePos);
        this.polygon.getPointAt(-1).copyFrom(mousePos);
    }

    onMouseUp(mousePos:Point) {
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
