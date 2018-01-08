import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'shape-thumb',
  templateUrl: './shape-thumb.component.html',
  styleUrls: ['./shape-thumb.component.css']
})
export class ShapeThumbComponent implements OnInit {
    @Input() shapeTemplate;

    constructor() { }

    ngOnInit() {}

    @HostListener('dragestart', ['$event'])
    onDragStart(event) {
        event.dataTransfer.setData(
            "shapeTemplate",
            JSON.stringify(this.shapeTemplate.toJsonOb())
        );
    }
}
