import { Shape, MultiShape } from '../shapes';
import { Point, extendCtx } from '../commons';

export class Scene {
    id;
    size: Point;
    containerShape: MultiShape;

    static sceneIdSeed = 0;

    constructor(size, containerShape = null) {
        this.id = ++Scene.sceneIdSeed;
        this.size = size;
        if (!containerShape) {
            containerShape = MultiShape.create(size.x, size.y);
        }
        this.containerShape = containerShape;
    }

    static createFromJson(jsonData) {
        let size = new Point(jsonData.root.doc.width, jsonData.root.doc.height);
        return new Scene(size, MultiShape.createFromJson(jsonData.root.shape));
    }

    toJsonOb() {
        let jsonOb:any = {
            root: {
                doc: {
                    width: this.size.x,
                    height: this.size.y
                },
                shape: this.containerShape.toJsonOb()
            }
        };
        return jsonOb;
    }

    equals(scene: Scene) {
        return scene && scene.id == this.id;
    }

    importFromJson(jsonData) {
        let multiShape = MultiShape.createFromJson(jsonData.root.shape);
        this.addShape(multiShape);
        return multiShape;
    }

    addShape(shape:Shape) {
        this.containerShape.addShape(shape);
    }

    draw(ctx) {
        this.containerShape.draw(ctx);
    }

    getDataUrl(width, height) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        this.drawOnCanvas(canvas, 2);
        return canvas.toDataURL();
    }

    drawOnCanvas(canvas, pad) {
        let ctx = canvas.getContext("2d");
        extendCtx(ctx);

        let canvasSize = new Point(canvas.width-2*pad, canvas.height-2*pad);

        let sceneScaleX =  canvasSize.x/this.size.x;
        let sceneScaleY = canvasSize.y/this.size.y;
        let sceneScale = Math.min(sceneScaleX, sceneScaleY);

        let sceneOffset = new Point(
                pad+(canvasSize.x-this.size.x*sceneScale)*0.5,
                pad+(canvasSize.y-this.size.y*sceneScale)*0.5);

        ctx.translate(sceneOffset.x, sceneOffset.y);

        //Make outline shadow
        ctx.shadowBlur = pad;
        ctx.shadowColor= "gray";
        ctx.fillStyle= "white";
        ctx.fillRect(0, 0, this.size.x*sceneScale, this.size.y*sceneScale);

        ctx.shadowBlur=0;
        ctx.scale(sceneScale, sceneScale);
        this.draw(ctx)
   }
}
