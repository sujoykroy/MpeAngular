import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HostListener,  ViewContainerRef, EventEmitter} from '@angular/core';
import { Scene } from '../../misc/scene'
import { SceneService } from '../../misc/scene.service'
import { Point } from '../../commons'

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

  @Input() scene:Scene;
  @Input() fakeChange;
  @ViewChild("canvas") thumbCanvasElem: ElementRef;

  @Input() set widthSize(value:Number) {
    this.resizeCanvas()
  }

  @Input() set heightSize(value:Number) {
    this.resizeCanvas()
  }

  constructor(public viewContainerRef: ViewContainerRef,
              public sceneService: SceneService) {
    this.mouseInitPos = new Point(0, 0);
    this.mousePos = new Point(0, 0);
    this.sceneOffset = new Point(0, 0);
  }

  ngOnInit() {}

  @HostListener("mousedown", ["$event"])
  onMouseDown(event) {
    this.mouseIsDown = true;
    this.mouseInitPos.assign(event.layerX, event.layerY);
    this.mousePos.assign(event.layerX, event.layerY);

    this.transformMousePoints(this.mouseInitPos);
    this.transformMousePoints(this.mousePos);

    this.scene.selectItemAt(this.mousePos);
  }

  @HostListener("mousemove", ["$event"])
  onMouseMove(event) {
    this.mousePos.assign(event.layerX, event.layerY);
    this.transformMousePoints(this.mousePos);
    if (this.mouseIsDown) {
        this.scene.moveActiveItem(this.mousePos.diff(this.mouseInitPos));
        this.draw();
    }
  }

  @HostListener("mouseup", ["$event"])
  onMouseUp(event) {
    this.mouseIsDown = false;
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

    let scene = this.sceneService.getActiveScene();
    let canvasSize = new Point(canvas.width-2*this.pad, canvas.height-2*this.pad);
    let sceneScaleX =  canvasSize.x/scene.size.x;
    let sceneScaleY = canvasSize.y/scene.size.y;

    this.sceneScale = Math.min(sceneScaleX, sceneScaleY);
    this.sceneOffset.assign(
            this.pad+(canvasSize.x-scene.size.x*this.sceneScale)*0.5,
            this.pad+(canvasSize.y-scene.size.y*this.sceneScale)*0.5);
  }

  ngAfterViewInit() {
    this.resizeCanvas();
    this.draw();
  }

  draw() {
    let canvas = this.thumbCanvasElem.nativeElement;
    let ctx = canvas.getContext("2d");
    let scene = this.sceneService.getActiveScene();
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
    ctx.restore();
  }

  ngOnChanges(changes) {
    this.draw();
  }
}
