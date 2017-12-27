import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'scene-thumb',
  templateUrl: './scene-thumb.component.html',
  styleUrls: ['./scene-thumb.component.css']
})
export class SceneThumbComponent implements OnInit {
  @Input() scene;
  @ViewChild("thumbCanvas") thumbCanvasElem: ElementRef;
  @Input() selected = false;

  constructor() { }

  ngOnInit() {
    let canvas = this.thumbCanvasElem.nativeElement;
    let ctx = canvas.getContext("2d");
    let pad = 10;
    ctx.shadowBlur=pad;
    ctx.shadowColor= this.selected ? "gray" : "black";
    ctx.fillStyle= "white";
    ctx.fillRect(pad, pad, canvas.width-2*pad, canvas.height-2*pad);
  }

  ngAfterViewInit() {

  }

}
