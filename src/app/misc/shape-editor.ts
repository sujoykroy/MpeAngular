import { Shape } from '../shapes';
import { Point, Color, parseColor,  drawRoundedRectangle} from '../commons';

const RESIZE_BOX_BORDER_COLOR = parseColor("#000000");
const RESIZE_BOX_FILL_COLOR = parseColor("#FFFFFF");
const RESIZE_BOX_WIDTH = 10;
const RESIZE_BOX_HEIGHT = 5;

const ROTATION_BOX_BORDER_COLOR = parseColor("#000000");
const ROTATION_BOX_FILL_COLOR = parseColor("#FFFFFF");
const ROTATION_BOX_RADIUS = 5;

const ANCHOR_BOX_BORDER_COLOR = parseColor("#000000");
const ANCHOR_BOX_FILL_COLOR = parseColor("#FF0000");

class EditBox {
    borderWidth:number = 1;
    center:Point;

    constructor(private borderColor:Color, private fillColor:Color) {
        this.center = new Point(0, 0);
    }

    isWithin(point:Point) { return false; }

    drawPath(ctx) {}

    drawBorder(ctx) {
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor.getStyleValue();
        ctx.stroke();
    }

    drawFill(ctx) {
        ctx.fillStyle = this.fillColor.getStyleValue();
        ctx.fill();
    }
}

class RectangleEditBox extends EditBox {
    width:number = RESIZE_BOX_WIDTH;
    height:number = RESIZE_BOX_HEIGHT;

    constructor(private angle:number) {
        super(RESIZE_BOX_BORDER_COLOR, RESIZE_BOX_FILL_COLOR);
    }

    isWithin(point:Point) {
        return point.x >= this.center.x-this.width*0.5 &&
               point.x <= this.center.x+this.width*0.5 &&
               point.y >= this.center.y-this.height*0.5 &&
               point.y <= this.center.y+this.height*0.5;
    }

    drawPath(ctx) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.angle*Math.PI/180);
        drawRoundedRectangle(ctx,-this.width*0.5, -this.height*0.5, this.width, this.height);
        ctx.restore();
    }
}

class OvalEditBox extends EditBox {
    radius:number = ROTATION_BOX_RADIUS;

    isWithin(point:Point) {
        return this.center.distance(point)<=this.radius;
    }

    drawPath(ctx) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2);
    }
}

export class ShapeEditor {
    sceneShape:Shape;
    selectedBox: EditBox;
    initSceneShape: Shape;
    rotationBoxes:OvalEditBox[] = [];

    resizeBoxLeft: RectangleEditBox;
    resizeBoxRight: RectangleEditBox;
    resizeBoxTop: RectangleEditBox;
    resizeBoxBottom: RectangleEditBox;

    anchorBox: OvalEditBox;
    editBoxes: EditBox[] = []

    constructor() {
        this.resizeBoxLeft = new RectangleEditBox(90);
        this.resizeBoxTop = new RectangleEditBox(180);
        this.resizeBoxRight = new RectangleEditBox(270);
        this.resizeBoxBottom = new RectangleEditBox(0);

        this.editBoxes.push(this.resizeBoxLeft);
        this.editBoxes.push(this.resizeBoxTop);
        this.editBoxes.push(this.resizeBoxRight);
        this.editBoxes.push(this.resizeBoxBottom);

        for(let i of [0, 1, 2, 3]) {
            let rotEditBox = new OvalEditBox(
                ROTATION_BOX_BORDER_COLOR, ROTATION_BOX_FILL_COLOR);
            this.rotationBoxes.push(rotEditBox);
            this.editBoxes.push(rotEditBox);
        }

        this.anchorBox = new OvalEditBox(ANCHOR_BOX_BORDER_COLOR, ANCHOR_BOX_FILL_COLOR);
        this.editBoxes.push(this.anchorBox);
    }

    setSceneShape(sceneShape:Shape) {
        this.sceneShape = sceneShape;
        if (sceneShape) {
            this.initSceneShape = sceneShape.copy();
            this.repositionBoxes();
        } else {
            this.initSceneShape = null;
        }
    }

    selectItemAt(point:Point) {
        if(!this.sceneShape) return false;

        let foundBox:EditBox = null;
        for(let editBox of this.editBoxes) {
            if (editBox.isWithin(point)) {
                foundBox = editBox;
                break;
            }
        }
        console.log(foundBox);
        this.selectedBox = foundBox;
        return !!this.selectedBox;
    }

    moveActiveItem(startPoint:Point, endPoint:Point) {
        if (!this.sceneShape) return;

        if (this.selectedBox) {
            //todo
        } else {
            let diffPoint = endPoint.diff(startPoint);
            let absAnchorAt = this.initSceneShape.getAbsAnchorAt();
            absAnchorAt.translate(diffPoint.x, diffPoint.y);

            this.sceneShape.moveTo(absAnchorAt);
        }
        this.repositionBoxes();
    }

    draw(ctx) {
        if (!this.sceneShape) return;
        let angle = this.sceneShape.getAbsAngle(0)*Math.PI/180;
        for(let editBox of this.editBoxes) {
            ctx.save();
            ctx.rotate(angle);
            editBox.drawPath(ctx);
            ctx.restore();
            editBox.drawFill(ctx);

            ctx.save();
            ctx.rotate(angle);
            editBox.drawPath(ctx);
            ctx.restore();
            editBox.drawBorder(ctx);
        }
    }

    repositionBoxes() {
        if(!this.sceneShape) return;
        let points:any[] = [
                [0, 0], [1, 0], [1, 1], [0, 1], //corners
                [0, 0.5], [0.5, 0], [1, 0.5], [0.5, 1], //sides
                [0.5, 0.5] //anchor
        ];
        for(let i=0; i<points.length; i++) {
            points[i] = new Point(
                this.sceneShape.width*points[i][0], this.sceneShape.height*points[i][1]);
            points[i] = this.sceneShape.getAbsReverseTransformPoint(points[i]);
        }
        for(let i=0; i<4; i++) {
            this.rotationBoxes[i].center.copyFrom(points[i]);
        }

        this.resizeBoxLeft.center.copyFrom(points[4]);
        this.resizeBoxTop.center.copyFrom(points[5]);
        this.resizeBoxRight.center.copyFrom(points[6]);
        this.resizeBoxBottom.center.copyFrom(points[7]);

        this.anchorBox.center.copyFrom(points[8]);
    }
}
