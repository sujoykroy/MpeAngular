import { Component, OnInit, Input } from '@angular/core';
import { Scene } from '../../misc/scene';
import { SceneService } from '../../misc/scene.service'

@Component({
  selector: 'app-scene-pane',
  templateUrl: './scene-pane.component.html',
  styleUrls: ['./scene-pane.component.css']
})

export class ScenePaneComponent implements OnInit {
    selectedScene:Scene;


    constructor(public sceneService: SceneService) {}

    ngOnInit() {}

    selectScene(scene:Scene) {
        this.sceneService.setActiveScene(scene);
    }

    isSelectedScene(scene:Scene) {
        return this.sceneService.isActiveScene(scene);
    }
}
