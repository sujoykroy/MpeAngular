import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { VerticalBarComponent } from './layout/vertical-bar/vertical-bar.component';
import { Scene } from './data/scene'
import { SceneService } from './data/scene.service'
import { ToolService } from './layout/tool.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  sceneService: SceneService;

  headerHeight = 100;
  footerHeight = 50;

  vertBarWidth = 10;
  scenePaneWidth = 100;
  libraryPaneWidth = 100;

  pressed = false;
  mousePosX = 0;
  downItemName = null;
  downLastValue = 0;

  constructor(toolService: ToolService, sceneService: SceneService) {
    this.sceneService = sceneService;
    toolService.addNewTool(
        "Scene",
        "New Scene",
        ()=>{
            sceneService.createScene();
        }
    );
  }

  getActiveScene() {
    return this.sceneService.getActiveScene();
  }

  @HostListener("mousedown", ["$event"])
  onMouseDown(event: any) {
    this.pressed = true;
    this.mousePosX = event.clientX

    let attribs = event.target.attributes
    if(attribs.name) {
        this.downItemName = attribs.name.value;
        if (this.downItemName == "sceneBar") {
            this.downLastValue = this.scenePaneWidth;
        } else if (this.downItemName == "libraryBar") {
            this.downLastValue = this.libraryPaneWidth;
        }
    } else {
        this.downItemName = null;
    }
  }

  @HostListener('mousemove', ["$event"])
  onMouseMove(event: any) {
    if (!this.pressed) return;

    let dX = event.clientX-this.mousePosX;
    if (this.downItemName == "sceneBar") {
        this.scenePaneWidth = this.downLastValue + dX;
    } else if (this.downItemName == "libraryBar") {
        this.libraryPaneWidth = this.downLastValue - dX;
    }
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.pressed = false;
    this.downLastValue = 0;
  }
}
