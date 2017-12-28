import { Component, OnInit, Input } from '@angular/core';
import { Scene } from '../../data/scene';
import { SceneService } from '../../data/scene.service'

@Component({
  selector: 'app-scene-pane',
  templateUrl: './scene-pane.component.html',
  styleUrls: ['./scene-pane.component.css']
})

export class ScenePaneComponent implements OnInit {
  selectedScene:Scene;
  sceneService: SceneService;

  constructor(sceneService: SceneService) {
    this.sceneService = sceneService;
  }

  ngOnInit() {}

  selectScene(scene:Scene) {
    this.sceneService.setActiveScene(scene);
  }

  isSelectedScene(scene:Scene) {
    return this.sceneService.isActiveScene(scene);
  }

  getScenes():Scene[] {
    return this.sceneService.getScenes();
  }
}
