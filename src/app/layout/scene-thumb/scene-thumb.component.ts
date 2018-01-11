import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'scene-thumb',
  templateUrl: './scene-thumb.component.html',
  styleUrls: ['./scene-thumb.component.css']
})
export class SceneThumbComponent implements OnInit {
    @Input() scene;
    @Input() set sceneUpdatedAt(value) {
        this.draw();
    }
    @ViewChild("thumbCanvas") thumbCanvasElem: ElementRef;
    @Input() selected;

    constructor() { }

    ngOnInit() {}

    ngOnChanges(changes) {
        this.draw();
    }

    draw() {
        let canvas = this.thumbCanvasElem.nativeElement;
        if(this.scene) {
            this.scene.drawOnCanvas(canvas, 10);
        }
    }
}
