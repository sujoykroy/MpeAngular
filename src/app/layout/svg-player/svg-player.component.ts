import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-svg-player',
  templateUrl: './svg-player.component.html',
  styleUrls: ['./svg-player.component.css']
})
export class SvgPlayerComponent implements OnInit {
    @ViewChild("svgContainer")
    svgContainer:ElementRef;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
        let node = this.svgContainer.nativeElement;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        node.appendChild(this.data.svg);
    }

}
