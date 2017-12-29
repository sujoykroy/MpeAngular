import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HostListener,  ViewContainerRef} from '@angular/core';
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

  @Input() scene:Scene;
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
    this.mouseInitPos.assign(event.clientX, event.clinetY);
    this.mousePos.assign(event.clientX, event.clinetY);
    this.scene.selectItemAt(this.mousePos);
  }

  @HostListener("mousemove", ["$event"])
  onMouseMove(event) {
    this.mousePos.assign(event.clientX, event.clinetY);
    this.scene.moveActiveItem(this.mousePos.diff(this.mouseInitPos));
  }

  @HostListener("mouseup", ["$event"])
  onMouseUp(event) {}

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
            -(scene.size.x*this.sceneScale-canvasSize.x)*0.5,
            -(scene.size.y*this.sceneScale-canvasSize.y)*0.5);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(this.sceneOffset.x, this.sceneOffset.y);
    ctx.scale(this.sceneScale, this.sceneScale);

    //Make outline shadow
    ctx.shadowBlur=this.pad;
    ctx.shadowColor= "gray";
    ctx.fillStyle= "white";
    ctx.fillRect(0, 0, scene.size.x, scene.size.y);

    ctx.shadowBlur=0;

    //ctx.translate(pad, pad);
    scene.draw(ctx)
  }

  ngOnChanges(changes) {
    this.draw();
  }
}
