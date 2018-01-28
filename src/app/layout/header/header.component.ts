import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service'
import { SceneService } from '../../misc/scene.service';
import { MatDialog } from '@angular/material';
import { SvgPlayerComponent } from '../svg-player/svg-player.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})


export class HeaderComponent implements OnInit {
    toolCategories = [];
    tools = {};

    constructor(toolService: ToolService,
              private sceneService:SceneService,
              private dialog:MatDialog) {
        this.toolCategories = Object.keys(toolService.tools);
        this.tools = toolService.tools;
    }

    showSVG(allScenes:boolean=true) {
        let svg:any;
        if (allScenes) {
            svg = this.sceneService.getSVG(0.25);
        } else {
            svg = this.sceneService.activeScene.getSVG(0.25);
        }
        this.dialog.open(SvgPlayerComponent, {
            data: { svg: svg }
        });
    }

    createNewPolygon() {
        this.sceneService.startShapeCreation("polygon")
    }

    createNewCurve() {
        this.sceneService.startShapeCreation("curve")
    }

    ngOnInit() {}
}
