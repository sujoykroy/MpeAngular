import { Injectable } from '@angular/core';
import { Scene } from './scene';
import { Point } from '../commons';
import { RectangleShape } from '../shapes'
import { MpFileService } from './mpfile.service';

@Injectable()
export class SceneService {
    scenes: Scene[] = [];
    activeScene:Scene;
    sceneSize:Point = new Point(1280, 720);

    constructor(private mpFileService: MpFileService) {
        for(let i =0; i<5; i++) {
            this.createScene();
        }
        this.activeScene = this.scenes[0];
        /*
        let scene = this.scenes[0];
        let rectShape1 = RectangleShape.create(100, 100, "#FF0000", "#00FF00", 10);
        rectShape1.moveTo(new Point(0, 0));
        //scene.addShape(rectShape1);

        let rectShape2 = RectangleShape.create(100, 100, "#FF0000", "#0000FF", 20);
        rectShape2.moveTo(new Point(100, 100));
        //scene.addShape(rectShape2);

        this.mpFileService.getFile(
            "http://localhost:3000/mp_file/sample.json", (data) => {
                scene.importFromJson(data);
        });
        */
    }

    createScene(size = null): Scene {
        if (!size) {
            size = this.sceneSize;
        }
        let scene = new Scene(size);
        this.scenes.push(scene);
        return scene;
    }

    setActiveScene(scene:Scene) {
        this.activeScene = scene;
    }

    moveToTime(t) {
        if(this.activeScene) {
            this.activeScene.moveTo(t);
            this.activeScene.reUpdate();
        }
    }

    isActiveScene(scene: Scene) {
        return this.activeScene && this.activeScene.equals(scene);
    }

    getScenes() {
        return this.scenes;
    }

    getActiveScene() {
        return this.activeScene || this.scenes[0];
    }

}
