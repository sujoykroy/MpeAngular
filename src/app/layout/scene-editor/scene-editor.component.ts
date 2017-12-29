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

  }

  ngOnInit() {}

  @HostListener("mousedown", ["event"])
  onMouseDown(event) {}

  @HostListener("mousemove", ["event"])
  onMouseMove(event) {}

  @HostListener("mouseup", ["event"])
  onMouseUp(event) {}

  resizeCanvas() {
    let canvas = this.thumbCanvasElem.nativeElement;
    let parentNode = this.viewContainerRef.element.nativeElement;
    canvas.width = parentNode.clientWidth;;
    canvas.height = parentNode.clientHeight;
  }

  ngAfterViewInit() {
    this.resizeCanvas();
    this.draw();
  }

  draw() {
    let parentNode = this.viewContainerRef.element.nativeElement;

    let canvas = this.thumbCanvasElem.nativeElement;
    let ctx = canvas.getContext("2d");
    let pad = 10;
    let scene = this.sceneService.getActiveScene();
    if (!scene) {
        return;
    }
    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let paddedSceneSize = new Point(scene.size.x+2*pad, scene.size.y+2*pad);
    let sceneScaleX =  canvas.width/paddedSceneSize.x;
    let sceneScaleY = canvas.height/paddedSceneSize.y;
    let sceneScale = Math.min(sceneScaleX, sceneScaleY);

    ctx.translate(
        -(paddedSceneSize.x*sceneScale-canvas.width)*0.5,
        -(paddedSceneSize.y*sceneScale-canvas.height)*0.5);
    ctx.scale(sceneScale, sceneScale);

    //Make outline shadow
    ctx.shadowBlur=pad;
    ctx.shadowColor= "gray";
    ctx.fillStyle= "white";
    ctx.fillRect(pad, pad, scene.size.x, scene.size.y);

    ctx.shadowBlur=0;

    ctx.translate(pad, pad);
    scene.draw(ctx)
  }

  ngOnChanges(changes) {
    this.draw();
  }
}
