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
        this.containerShape = MultiShape.create(size.x, size.y);
    }

    equals(scene: Scene) {
        return scene && scene.id == this.id;
    }

    importFromJson(jsonData) {
        let multiShape = MultiShape.createFromJson(jsonData.root.shape);
        this.addShape(multiShape);
    }

    addShape(shape:Shape) {
        this.containerShape.addShape(shape);
    }

    draw(ctx) {
        this.containerShape.draw(ctx);
    }
}
