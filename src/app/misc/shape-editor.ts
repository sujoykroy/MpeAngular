import { Shape, MultiShape } from '../shapes';
import { Point, Color, parseColor,  drawRoundedRectangle} from '../commons';

const RESIZE_BOX_BORDER_COLOR = parseColor("#000000");
const RESIZE_BOX_FILL_COLOR = parseColor("#FFFFFF");
const RESIZE_BOX_WIDTH = 20;
const RESIZE_BOX_HEIGHT = 10;
const RESIZE_BOX_SIZE = (RESIZE_BOX_WIDTH+RESIZE_BOX_HEIGHT)*0.5;

const ROTATION_BOX_BORDER_COLOR = parseColor("#000000");
const ROTATION_BOX_FILL_COLOR = parseColor("#FFFFFF");
const ROTATION_BOX_RADIUS = 10;

const ANCHOR_BOX_BORDER_COLOR = parseColor("#FF0000");
const ANCHOR_BOX_FILL_COLOR = parseColor("#FFFFFF55");

const BOX_OFFSET = 0;

class EditBox {
    borderWidth:number = 1;
    center:Point;
    name: string;
    offset:Point;

    constructor(name:string, offset:number[], private borderColor:Color, private fillColor:Color) {
        this.center = new Point(0, 0);
        this.name = name;
        this.offset = new Point(offset[0], offset[1]);
    }

    setCenter(point: Point) {
        this.center.copyFrom(point);
        this.center.translate(this.offset.x, this.offset.y);
    }

    isWithin(point:Point, rotateAngle:number=0) { return false; }

    drawPath(ctx, rotateAngle=0) {}

    drawBorder(ctx) {
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor.getStyleValue();
        ctx.stroke();
    }

    drawFill(ctx) {
        ctx.fillStyle = this.fillColor.getStyleValue();
        ctx.fill();
    }

    equals(other: EditBox) {
        return this.name == other.name;
    }
}

class RectangleEditBox extends EditBox {
    constructor(name:string, private angle:number, offset:number[],
                private width:number = RESIZE_BOX_WIDTH,
                private height:number = RESIZE_BOX_HEIGHT) {
        super(name, offset, RESIZE_BOX_BORDER_COLOR, RESIZE_BOX_FILL_COLOR);
    }

    isWithin(point:Point, rotateAngle) {
        point = point.copy();
        point.translate(-this.center.x, -this.center.y);
        point.rotateCoordinate(rotateAngle+this.angle);
        return point.x >= -this.width*0.5 &&
               point.x <= this.width*0.5 &&
               point.y >= -this.height*0.5 &&
               point.y <= this.height*0.5;
    }

    drawPath(ctx, rotateAngle) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate((rotateAngle+this.angle)*Math.PI/180);
        drawRoundedRectangle(ctx,-this.width*0.5, -this.height*0.5, this.width, this.height);
        ctx.restore();
    }
}

class OvalEditBox extends EditBox {
    radius:number = ROTATION_BOX_RADIUS;

    isWithin(point:Point, rotateAngle:number=0) {
        return this.center.distance(point)<=this.radius;
    }

    drawPath(ctx, rotateAngle=0) {
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
    resizeBoxBottomRight: RectangleEditBox;

    anchorBox: OvalEditBox;
    editBoxes: EditBox[] = []

    constructor() {
        this.resizeBoxLeft = new RectangleEditBox("sL", 90, [-BOX_OFFSET, 0]);
        this.resizeBoxTop = new RectangleEditBox("sT", 180, [0, -BOX_OFFSET]);
        this.resizeBoxRight = new RectangleEditBox("sR", 270, [BOX_OFFSET, 0]);
        this.resizeBoxBottom = new RectangleEditBox("sB", 0, [0, BOX_OFFSET]);
        this.resizeBoxBottomRight = new RectangleEditBox("sBR", 0, [BOX_OFFSET, BOX_OFFSET],
                                    RESIZE_BOX_SIZE, RESIZE_BOX_SIZE);

        this.editBoxes.push(this.resizeBoxLeft);
        this.editBoxes.push(this.resizeBoxTop);
        this.editBoxes.push(this.resizeBoxRight);
        this.editBoxes.push(this.resizeBoxBottom);
        this.editBoxes.push(this.resizeBoxBottomRight);

        let offset;
        for(let i of [0, 1, 2]) {
            if (i==0) {
                offset = [-BOX_OFFSET, -BOX_OFFSET];
            } else if (i == 1) {
                offset = [BOX_OFFSET, -BOX_OFFSET];
            } else {
                offset = [-BOX_OFFSET, BOX_OFFSET];
            }
            let rotEditBox = new OvalEditBox(
                ("r" + (i+1)), offset, ROTATION_BOX_BORDER_COLOR, ROTATION_BOX_FILL_COLOR);
            this.rotationBoxes.push(rotEditBox);
            this.editBoxes.push(rotEditBox);
        }

        this.anchorBox = new OvalEditBox("a", [0, 0], ANCHOR_BOX_BORDER_COLOR, ANCHOR_BOX_FILL_COLOR);
        this.anchorBox.borderWidth *= 2;
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

    reload() {
        this.setSceneShape(this.sceneShape);
    }

    selectItemAt(point:Point) {
        if(!this.sceneShape) return false;

        let foundBox:EditBox = null;
        let absAngle = this.sceneShape.getAbsAngle(0);
        for(let editBox of this.editBoxes) {
            if (editBox.isWithin(point, absAngle)) {
                foundBox = editBox;
                break;
            }
        }
        this.selectedBox = foundBox;
        return !!this.selectedBox;
    }

    moveActiveItem(startPoint:Point, endPoint:Point) {
        if (!this.sceneShape) return null;
        let movementType = null;
        if (this.selectedBox) {
            let relStartPoint = this.initSceneShape.transformPoint(startPoint);
            let relEndPoint = this.initSceneShape.transformPoint(endPoint);
            let relDiffPoint = relEndPoint.diff(relStartPoint);

            if (this.selectedBox.equals(this.resizeBoxBottom)) {
                if (this.sceneShape instanceof MultiShape) {
                    this.sceneShape.postScaleY = this.initSceneShape.postScaleY *
                        ((this.initSceneShape.height+relDiffPoint.y)/this.initSceneShape.height);
                } else {
                    this.sceneShape.setHeight(this.initSceneShape.height+relDiffPoint.y, false);
                }
                movementType = Shape.MOVE_TYPE_RESIZE;
            } else if (this.selectedBox.equals(this.resizeBoxRight)) {
                if (this.sceneShape instanceof MultiShape) {
                    this.sceneShape.postScaleX = this.initSceneShape.postScaleX *
                        ((this.initSceneShape.width+relDiffPoint.x)/this.initSceneShape.width);
                } else {
                    this.sceneShape.setWidth(this.initSceneShape.width+relDiffPoint.x, false);
                }
                movementType = Shape.MOVE_TYPE_RESIZE;
            } else if (this.selectedBox.equals(this.resizeBoxTop)) {
                let initAbsAnchorAt = this.initSceneShape.getAbsAnchorAt();
                if (this.sceneShape instanceof MultiShape) {
                    this.sceneShape.postScaleY = this.initSceneShape.postScaleY *
                    ((this.initSceneShape.height-relDiffPoint.y)/this.initSceneShape.height);

                    this.sceneShape.anchorAt.y = this.initSceneShape.height-
                        (this.initSceneShape.height-this.initSceneShape.anchorAt.y)*
                        (this.initSceneShape.postScaleY/this.sceneShape.postScaleY);
                } else {
                    this.sceneShape.anchorAt.y = this.initSceneShape.anchorAt.y - relDiffPoint.y;
                    this.sceneShape.setHeight(this.initSceneShape.height-relDiffPoint.y, false);
                }
                this.sceneShape.moveTo(initAbsAnchorAt);
                movementType = Shape.MOVE_TYPE_RESIZE;
            } else if (this.selectedBox.equals(this.resizeBoxLeft)) {
                let initAbsAnchorAt = this.initSceneShape.getAbsAnchorAt();
                if (this.sceneShape instanceof MultiShape) {
                    this.sceneShape.postScaleX = this.initSceneShape.postScaleX *
                    ((this.initSceneShape.width-relDiffPoint.x)/this.initSceneShape.width);

                    this.sceneShape.anchorAt.x = this.initSceneShape.width-
                        (this.initSceneShape.width-this.initSceneShape.anchorAt.x)*
                        (this.initSceneShape.postScaleX/this.sceneShape.postScaleX);
                } else {
                    this.sceneShape.anchorAt.x = this.initSceneShape.anchorAt.x - relDiffPoint.x;
                    this.sceneShape.setWidth(this.initSceneShape.width-relDiffPoint.x, false);
                }
                this.sceneShape.moveTo(initAbsAnchorAt);
                movementType = Shape.MOVE_TYPE_RESIZE;
            } else if (this.selectedBox.equals(this.resizeBoxBottomRight)) {
                if (this.sceneShape instanceof MultiShape) {
                    this.sceneShape.postScaleX = this.initSceneShape.postScaleX *
                        ((this.initSceneShape.width+relDiffPoint.x)/this.initSceneShape.width);
                    this.sceneShape.postScaleY = this.initSceneShape.postScaleY *
                        ((this.initSceneShape.height+relDiffPoint.y)/this.initSceneShape.height);
                } else {
                    this.sceneShape.setWidth(this.initSceneShape.width+relDiffPoint.x, false);
                    this.sceneShape.setHeight(this.initSceneShape.height+relDiffPoint.y, false);
                }
                movementType = Shape.MOVE_TYPE_RESIZE;
            } else if (this.selectedBox.equals(this.anchorBox)) {
                this.sceneShape.anchorAt.assign(
                    this.initSceneShape.anchorAt.x+relDiffPoint.x,
                    this.initSceneShape.anchorAt.y+relDiffPoint.y);
                movementType = Shape.MOVE_TYPE_ANCHOR;
            } else {
                let matchedRotationBox = null;
                for(let editBox of this.rotationBoxes) {
                    if (this.selectedBox.equals(editBox)) {
                        matchedRotationBox = editBox;
                        break;
                    }
                }
                if (matchedRotationBox) {
                    let initAbsAnchorAt = this.initSceneShape.getAbsAnchorAt();
                    let relAnchorStartPoint = startPoint.diff(initAbsAnchorAt);
                    let relAnchorEndPoint = endPoint.diff(initAbsAnchorAt);
                    let dangle = relAnchorEndPoint.getAngle() - relAnchorStartPoint.getAngle();
                    this.sceneShape.setAngle(this.initSceneShape.angle+dangle);
                    movementType = Shape.MOVE_TYPE_ROTATE;
                }
            }
        } else {
            let diffPoint = endPoint.diff(startPoint);
            let absAnchorAt = this.initSceneShape.getAbsAnchorAt();
            absAnchorAt.translate(diffPoint.x, diffPoint.y);

            this.sceneShape.moveTo(absAnchorAt);
            movementType = Shape.MOVE_TYPE_XY;
        }
        this.repositionBoxes();
        return movementType;
    }

    draw(ctx) {
        if (!this.sceneShape) return;
        let angle = this.sceneShape.getAbsAngle(0);
        let anchorAt = this.anchorBox.center;
        for(let editBox of this.editBoxes) {
            ctx.save();
            editBox.drawPath(ctx, angle);
            ctx.restore();
            editBox.drawFill(ctx);

            ctx.save();
            editBox.drawPath(ctx, angle);
            ctx.restore();
            editBox.drawBorder(ctx);
        }
    }

    repositionBoxes() {
        if(!this.sceneShape) return;
        let points:any[] = [
                [0, 0], [1, 0], [0, 1], [1, 1], //corners
                [0, 0.5], [0.5, 0], [1, 0.5], [0.5, 1], //sides
                [this.sceneShape.anchorAt.x, this.sceneShape.anchorAt.y] //anchor
        ];
        for(let i=0; i<points.length; i++) {
            if (i<points.length-1) {
                points[i] = new Point(
                    this.sceneShape.width*points[i][0], this.sceneShape.height*points[i][1]);
            } else {
                points[i] = new Point(points[i][0], points[i][1]);
            }
            points[i] = this.sceneShape.getAbsReverseTransformPoint(points[i]);
        }
        for(let i=0; i<3; i++) {
            this.rotationBoxes[i].setCenter(points[i]);
        }

        this.resizeBoxBottomRight.setCenter(points[3]);
        this.resizeBoxLeft.setCenter(points[4]);
        this.resizeBoxTop.setCenter(points[5]);
        this.resizeBoxRight.setCenter(points[6]);
        this.resizeBoxBottom.setCenter(points[7]);
        this.anchorBox.setCenter(points[8]);
    }
}
