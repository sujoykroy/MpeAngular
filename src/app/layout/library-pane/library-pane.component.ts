import { Component, OnInit, ComponentFactoryResolver, Input } from '@angular/core';
import { MpFileService } from './../../misc/mpfile.service';
import { SceneService } from './../../misc/scene.service';
import { Scene } from './../../misc/scene';

@Component({
  selector: 'app-library-pane',
  templateUrl: './library-pane.component.html',
  styleUrls: ['./library-pane.component.css']
})
export class LibraryPaneComponent implements OnInit {
    @Input() shapeTemplates = [];

    constructor(private mpFileService: MpFileService,
                public sceneService: SceneService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.shapeTemplates.length==0) {
            this.mpFileService.getShapeTemplatesData((data)=> {
                for(let jsonData of data) {
                    let shapeTemplate = Scene.createFromJson(jsonData);
                    this.shapeTemplates.push(shapeTemplate);
                }
            });
        }
    }
}
