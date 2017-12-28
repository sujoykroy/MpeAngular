import { Shape } from '../shapes/shape';
import { Point } from '../commons';
import { MultiShape } from '../shapes';

export class Scene {
    id;
    size: Point;
    containerShape: MultiShape;

    constructor(id:number, size) {
        this.id = id
        this.size = size;
        this.containerShape = MultiShape.create();
    }

    equals(scene: Scene) {
        return scene && scene.id == this.id;
    }

    addShape(shape:Shape) {

    }

    draw(ctx) {

    }
}
