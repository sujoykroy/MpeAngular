import { Point, parseColor } from '../commons';
import { PolygonShape } from '../shapes';
import { OvalEditBox } from '../shapes/edit-boxes';

class PointEditBox extends OvalEditBox {
    constructor(private polyPoint: Point, private polygonShape:PolygonShape) {
        super("", [0, 0],
            PolygonShape.POINT_EDIT_BOX_BORDER_COLOR,
            PolygonShape.POINT_EDIT_BOX_FILL_COLOR, 10);
        this.updateCenter();
    }

    updateCenter() {
        let point = new Point(
                        this.polyPoint.x*this.polygonShape.width,
                        this.polyPoint.y*this.polygonShape.height);
        this.center.copyFrom(this.polygonShape.getAbsReverseTransformPoint(point));
    }

    setCenter(center:Point) {
        this.center.copyFrom(center);
        let point = this.polygonShape.getAbsTransformPoint(center);
        this.polyPoint.x = point.x/this.polygonShape.width;
        this.polyPoint.y = point.y/this.polygonShape.height;
    }
}

export class PolygonShapeEditor {
    editBoxes: PointEditBox[];
    selectedBox:PointEditBox;
    initCenter:Point;

    constructor(private polygonShape:PolygonShape) {
        this.initCenter = new Point(0, 0);
        this.editBoxes = [];
        this.buildEditBoxes();
    }

    buildEditBoxes() {
        this.editBoxes.length = 0;
        for (let polygon of this.polygonShape.polygons) {
            for (let point of polygon.points) {
                this.editBoxes.push(new PointEditBox(point, this.polygonShape));
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
        this.selectedBox.setCenter(center);
    }

    draw(ctx) {
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
