import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-svg-player',
  templateUrl: './svg-player.component.html',
  styleUrls: ['./svg-player.component.css']
})
export class SvgPlayerComponent {
    @ViewChild("svgContainer")
    svgContainer:ElementRef;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

    ngAfterViewInit() {
        let node = this.svgContainer.nativeElement;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        node.innerHTML = this.data.svg.outerHTML;
    }

}
