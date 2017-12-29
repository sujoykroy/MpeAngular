import { Shape } from '../shapes/shape';
import { Point } from '../commons';
import { MultiShape } from '../shapes';

export class Scene {
    id;
    size: Point;
    containerShape: MultiShape;
    selectedShape: Shape;
    initShape: Shape = null;

    constructor(id:number, size) {
        this.id = id
        this.size = size;
        this.containerShape = MultiShape.create();
    }

    selectItemAt(point:Point) {
        let foundShape:Shape = null;
        for(let shape of this.containerShape.shapes) {
            if (shape.isWithin(point)) {
                foundShape = shape;
            }
        }
        this.initShape = null;
        if (!!foundShape) {
            this.initShape = foundShape.copy();
        }
        console.log(foundShape, point);
        this.selectedShape = foundShape;
    }

    moveActiveItem(diffPoint:Point) {
        if (!this.selectedShape) return;
        let absAnchorAt = this.initShape.getAbsAnchorAt();
        absAnchorAt.translate(diffPoint.x, diffPoint.y);
        this.selectedShape.moveTo(absAnchorAt);
    }

    equals(scene: Scene) {
        return scene && scene.id == this.id;
    }

    addShape(shape:Shape) {
        this.containerShape.addShape(shape);
    }

    draw(ctx) {
        this.containerShape.draw(ctx);
    }
}
