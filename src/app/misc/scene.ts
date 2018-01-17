import { Shape, MultiShape } from '../shapes';
import { RectangleShape, OvalShape, TextShape } from '../shapes';

import { Point, extendCtx, SVGNode } from '../commons';
import { MultiShapeTimeLine } from '../time-lines/multishape-time-line';

export class Scene {
    id;
    size: Point;
    containerShape: MultiShape;
    lastUpdatedAt:number = 0;
    duration = 10;
    currentTimePos = 0;

    static sceneIdSeed = 0;

    constructor(size, containerShape = null) {
        this.id = ++Scene.sceneIdSeed;
        this.size = size;
        if (!containerShape) {
            containerShape = MultiShape.create(size.x, size.y);
        }
        this.containerShape = containerShape;
    }

    reUpdate() {
        this.lastUpdatedAt = (new Date()).getTime();
    }

    static createFromJson(jsonData) {
        let size = new Point(jsonData.root.doc.width, jsonData.root.doc.height);
        return new Scene(size, MultiShape.createFromJson(jsonData.root.shape));
    }

    static createSingleShape(shapeTypeName, width=100, height=100) {
        let scene = new Scene(new Point(width, height));
        let shape:Shape;
        let shapeW:number = width*0.8;
        let shapeH:number = height*0.8;
        switch(shapeTypeName) {
            case RectangleShape.TypeName:
                shape = new RectangleShape(new Point(shapeW*0.5, shapeH*0.5),
                                        "#000000", "#FFFFFF00", shapeW, shapeH, 0);
                break;
            case OvalShape.TypeName:
                shape = new OvalShape( new Point(shapeW*0.5, shapeH*0.5),
                                        "#000000", "#FFFFFF00", shapeW, shapeH);
                break;
            case TextShape.TypeName:
                let textShape = new TextShape( new Point(shapeW*0.5, shapeH*0.5),
                                        "#000000", "#FFFFFF00",
                                        shapeW, shapeH, 0, "Text");
                shape = textShape;
                break;
        }
        scene.addShape(shape);
        shape.moveTo(new Point(width*0.5, height*0.5));
        return scene;
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

    getMainTimeLine() {
        return this.containerShape.getNewTimeLine(MultiShapeTimeLine, "main");
    }

    draw(ctx) {
        this.containerShape.draw(ctx);
    }

    getDataUrl(width, height) {
        if( "dataUrl" in this) {
            return this["dataUrl"];
        }
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        this.drawOnCanvas(canvas, 2);
        this["dataUrl"] = canvas.toDataURL();
        return this["dataUrl"];
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

        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(sceneOffset.x, sceneOffset.y);

        //Make outline shadow
        ctx.shadowBlur = pad;
        ctx.shadowColor= "gray";
        ctx.fillStyle= "white";
        ctx.fillRect(0, 0, this.size.x*sceneScale, this.size.y*sceneScale);

        ctx.shadowBlur=0;
        ctx.scale(sceneScale, sceneScale);
        this.draw(ctx)
        ctx.restore();
   }

    getSVG(scale:number) {
        scale = 1;
        let svgNode = new SVGNode("svg");
        let viewBox = "0 0 " + this.size.x.toString() + " " + this.size.y.toString();
        //svgNode.setParam("viewBox", viewBox);
        //svgNode.transform(null, null, null, scale);
        svgNode.setParam("x", 0);
        svgNode.setParam("y", 0);

        svgNode.setParam("width", this.size.x*scale);
        svgNode.setParam("height", this.size.y*scale);
        svgNode.addChild(this.containerShape.getSVGNode())
        return svgNode.domElement;
    }
}
