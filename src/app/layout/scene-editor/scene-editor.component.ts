import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HostListener,  ViewContainerRef, EventEmitter} from '@angular/core';
import { Scene } from '../../misc/scene';
import { SceneService } from '../../misc/scene.service';
import { Point, extendCtx } from '../../commons';
import { ShapeEditor } from '../../shape-editors/shape-editor';
import { Shape, MultiShape } from '../../shapes';
import { PolygonShapeCreator, CurveShapeCreator } from '../../shape-creators';

@Component({
  selector: 'scene-editor',
  templateUrl: './scene-editor.component.html',
  styleUrls: ['./scene-editor.component.css']
})

export class SceneEditorComponent implements OnInit {
    mouseInitPos: Point;
    mousePos:Point;
    pad:number = 10;

    sceneScale:number = 1;
    sceneOffset: Point;

    mouseIsDown: boolean = false;
    movementType;

    shapeEditor: ShapeEditor = null;
    shapeCreator:any = null;

    @Input() scene:Scene;
    @Input() fakeChange;
    @ViewChild("canvas") thumbCanvasElem: ElementRef;

    constructor(public viewContainerRef: ViewContainerRef,
              public sceneService: SceneService) {
        this.mouseInitPos = new Point(0, 0);
        this.mousePos = new Point(0, 0);
        this.sceneOffset = new Point(0, 0);
        this.shapeEditor = new ShapeEditor();
    }

    @Input() set sceneUpdatedAt(value) {
        this.shapeEditor.repositionBoxes();
        this.draw();
    }

    @HostListener("mousedown", ["$event"])
    onMouseDown(event) {
        this.mouseIsDown = true;
        this.mouseInitPos.assign(event.layerX, event.layerY);
        this.mousePos.assign(event.layerX, event.layerY);

        this.transformMousePoints(this.mouseInitPos);
        this.transformMousePoints(this.mousePos);

        if (this.sceneService.createMode) {
            if (!this.shapeCreator) {
                if (this.sceneService.createMode == "polygon") {
                    this.shapeCreator = new PolygonShapeCreator();
                } else if (this.sceneService.createMode == "curve") {
                    this.shapeCreator = new CurveShapeCreator();
                }
            }
            this.shapeCreator.onMouseDown(this.mousePos);
        } else {
            this.selectItemAt(this.mousePos);
        }
        this.draw();
    }

    @HostListener("mousemove", ["$event"])
    onMouseMove(event) {
        this.mousePos.assign(event.layerX, event.layerY);
        this.transformMousePoints(this.mousePos);
        if (this.sceneService.createMode && this.shapeCreator) {
            this.shapeCreator.onMouseMove(this.mousePos, this.mouseIsDown);
            this.draw();
        } else if (this.mouseIsDown) {
            this.movementType = this.shapeEditor.moveActiveItem(this.mouseInitPos, this.mousePos);
            this.draw();
        }
    }

    @HostListener("dragover", ["$event"])
    onDragOver(event) {
        event.preventDefault();
    }

    @HostListener("drop", ["$event"])
    onDrop(event) {
        event.stopPropagation();
        let shapeTemplate = event.dataTransfer.getData("shapeTemplate");

        if(shapeTemplate) {
            this.shapeCreator = null;
            this.sceneService.startShapeCreation(null);

            let scene = this.sceneService.activeScene;
            let jsonData = JSON.parse(shapeTemplate);
            let rootShape = jsonData.root.shape;

            let shape;
            if (rootShape.shape instanceof Array) {
                shape = MultiShape.getShapeFromJson(rootShape);
            } else {
                shape = MultiShape.getShapeFromJson(rootShape.shape);
            }
            scene.addShape(shape);

            let point = new Point(event.layerX, event.layerY);
            this.transformMousePoints(point);
            point = this.scene.containerShape.transformPoint(point);
			shape.moveTo(point);

            this.draw();
            scene.reUpdate();
        }
    }

    @HostListener("mouseup", ["$event"])
    onMouseUp(event) {
        this.mouseIsDown = false;
        if (this.sceneService.createMode && this.shapeCreator) {
            this.shapeCreator.onMouseUp(this.mousePos);
        } else if(this.shapeEditor.sceneShape) {
            this.shapeEditor.reload();
            let shape:Shape = this.shapeEditor.sceneShape;
            switch(this.movementType) {
                case Shape.MOVE_TYPE_RESIZE:
                    this.sceneService.insertShapePropValue(shape, "width");
                    this.sceneService.insertShapePropValue(shape, "height");
                    break;
                case Shape.MOVE_TYPE_ANCHOR:
                    this.sceneService.insertShapePropValue(shape, "anchorAt");
                    break;
                case Shape.MOVE_TYPE_XY:
                    this.sceneService.insertShapePropValue(shape, "xy");
                    break;
                case Shape.MOVE_TYPE_ROTATE:
                    this.sceneService.insertShapePropValue(shape, "angle");
                    break;
            }
            this.movementType = null;
        }
        this.draw();
    }

    @HostListener("dblclick", ["$event"])
    onDoubleClick(event) {
        if (this.sceneService.createMode && this.shapeCreator) {
            this.shapeCreator.onDoubleClick(this.mousePos);
            let newShape:Shape = this.shapeCreator.getFinishedShape();
            if (newShape) {
                this.sceneService.addShape(newShape);
            }
            this.shapeCreator = null;
            this.sceneService.startShapeCreation(null);
        }
    }

    selectItemAt(point:Point) {
        if (!this.shapeEditor.selectItemAt(point)) {
            point = this.scene.containerShape.transformPoint(point);

            let scene = this.sceneService.activeScene;
            let foundShape:Shape = null;
            for(let i=scene.containerShape.shapes.length-1; i>=0; i--) {
                let shape = scene.containerShape.shapes[i];
                if (shape.isWithin(point)) {
                    foundShape = shape;
                    break;
                }
            }
            this.sceneService.setActiveShape(foundShape);
            this.shapeEditor.setSceneShape(foundShape);
        }
    }

    transformMousePoints(point) {
        point.translate(-this.sceneOffset.x, -this.sceneOffset.y);
        point.scale(1/this.sceneScale, 1/this.sceneScale);
    }

    resizeCanvas() {
        let canvas = this.thumbCanvasElem.nativeElement;
        let parentNode = this.viewContainerRef.element.nativeElement;
        canvas.width = parentNode.clientWidth;;
        canvas.height = parentNode.clientHeight;

        let scene = this.sceneService.activeScene;
        let canvasSize = new Point(canvas.width-2*this.pad, canvas.height-2*this.pad);
        let sceneScaleX =  canvasSize.x/scene.size.x;
        let sceneScaleY = canvasSize.y/scene.size.y;

        this.sceneScale = Math.min(sceneScaleX, sceneScaleY);
        this.sceneOffset.assign(
                this.pad+(canvasSize.x-scene.size.x*this.sceneScale)*0.5,
                this.pad+(canvasSize.y-scene.size.y*this.sceneScale)*0.5);
    }

    draw() {
        let canvas = this.thumbCanvasElem.nativeElement;
        let ctx = canvas.getContext("2d");
        extendCtx(ctx);
        let scene = this.sceneService.activeScene;
        if (!scene) {
            return;
        }
        //clear the canvas
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(this.sceneOffset.x, this.sceneOffset.y);

        //Make outline shadow
        ctx.shadowBlur=this.pad;
        ctx.shadowColor= "gray";
        ctx.fillStyle= "white";
        ctx.fillRect(0, 0, scene.size.x*this.sceneScale, scene.size.y*this.sceneScale);

        ctx.shadowBlur=0;
        ctx.scale(this.sceneScale, this.sceneScale);
        scene.draw(ctx)

        if (this.sceneService.createMode && this.shapeCreator) {
            this.shapeCreator.draw(ctx);
        } else {
            this.shapeEditor.draw(ctx);
        }
        ctx.restore();
    }

    ngOnChanges(changes) {
        this.draw();
    }

    ngAfterViewInit() {
        this.resizeCanvas();
        this.draw();
    }

    ngOnInit() {}

    @Input() set widthSize(value:Number) {
        this.resizeCanvas()
    }

    @Input() set heightSize(value:Number) {
        this.resizeCanvas()
    }
}
