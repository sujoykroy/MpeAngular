import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HostListener,  ViewContainerRef} from '@angular/core';
import { Scene } from '../../data/scene'
import { SceneService } from '../../data/scene.service'

@Component({
  selector: 'scene-editor',
  templateUrl: './scene-editor.component.html',
  styleUrls: ['./scene-editor.component.css']
})

export class SceneEditorComponent implements OnInit {
  @Input() scene:Scene;
  @ViewChild("canvas") thumbCanvasElem: ElementRef;

  constructor(public viewContainerRef: ViewContainerRef,
              public sceneService: SceneService) {

  }

  ngOnInit() {
    console.log("oninit");
  }

  @HostListener("mousedown", ["event"])
  onMouseDown(event) {
    console.log("mousedown");
  }

  @HostListener("mousemove", ["event"])
  onMouseMove(event) {
    console.log("mousemove");
  }

  @HostListener("mouseup", ["event"])
  onMouseUp(event) {
    console.log("mouseup");
  }

  ngAfterViewInit() {
    let canvas = this.thumbCanvasElem.nativeElement;
    let parentNode = this.viewContainerRef.element.nativeElement;
    canvas.width = parentNode.clientWidth;;
    canvas.height = parentNode.clientHeight;

    this.draw();
  }

  draw() {
    let parentNode = this.viewContainerRef.element.nativeElement;

    let canvas = this.thumbCanvasElem.nativeElement;
    let ctx = canvas.getContext("2d");
    let pad = 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur=pad;
    ctx.shadowColor= "gray";
    ctx.fillStyle= "white";
    ctx.fillRect(pad, pad, canvas.width-2*pad, canvas.height-2*pad);

    ctx.shadowBlur=0;
    ctx.arc(canvas.width*.5, canvas.height*.5, 50, 0, Math.PI *2);
    ctx.stroke()
  }

  ngOnChanges(changes) {
    this.draw();
  }
}
