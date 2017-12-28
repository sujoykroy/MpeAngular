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
  @Input() selected;

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes) {
    let canvas = this.thumbCanvasElem.nativeElement;
    let ctx = canvas.getContext("2d");
    let pad = 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur=pad;
    ctx.shadowColor= this.selected ? "black" : "gray";
    ctx.fillStyle= "white";
    ctx.fillRect(pad, pad, canvas.width-2*pad, canvas.height-2*pad);;
  }

}
