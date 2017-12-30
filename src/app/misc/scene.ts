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
        for(let i=this.containerShape.shapes.length-1; i>=0; i--) {
            let shape = this.containerShape.shapes[i];
            if (shape.isWithin(point)) {
                foundShape = shape;
                break;
            }
        }
        this.initShape = null;
        if (!!foundShape) {
            this.initShape = foundShape.copy();
        }
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
