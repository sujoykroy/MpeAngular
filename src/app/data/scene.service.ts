import { Injectable } from '@angular/core';
import {Scene} from './scene'

@Injectable()
export class SceneService {
  scenes: Scene[] = [];
  sceneIdSeed = 0;
  activeScene:Scene;
  width = 1280;
  height = 720;

  constructor() {
    for(let i =0; i<5; i++) {
        this.createScene();
    }
  }

  createScene(): Scene {
    let scene = new Scene(++this.sceneIdSeed);
    this.scenes.push(scene);
    return scene;
  }

  setActiveScene(scene:Scene) {
    this.activeScene = scene;
  }

  isActiveScene(scene: Scene) {
    return this.activeScene && this.activeScene.equals(scene);
  }

  getScenes() {
    return this.scenes;
  }

  getActiveScene() {
    return this.activeScene;
  }

}
