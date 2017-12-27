import { Injectable } from '@angular/core';
import {Scene} from './scene'

@Injectable()
export class SceneService {
  scenes: Scene[] = [];
  sceneIdSeed = 0;

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
}
