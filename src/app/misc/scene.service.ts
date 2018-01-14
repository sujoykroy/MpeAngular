import { Injectable } from '@angular/core';
import { Scene } from './scene';
import { Point } from '../commons';
import { TimeMarker } from '../time-lines/time-marker';

@Injectable()
export class SceneService {
    scenes: Scene[] = [];
    sceneSize:Point = new Point(1280, 720);

    activeScene:Scene;
    activeTimeLine;
    activeTimeMarkers: TimeMarker[] = [];

    timePos: number = 0;

    constructor() {
        for(let i =0; i<5; i++) {
            this.createScene();
        }
        this.setActiveScene(this.scenes[0]);
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
        if (!scene.equals(this.activeScene)) {
            this.timePos = 0;
        }
        this.activeScene = scene;
        this.activeTimeLine = scene.getMainTimeLine();
        this.activeTimeMarkers = this.activeTimeLine.timeMarkers;
    }

    insertShapePropValue(shape, propName) {
        let propValue = shape.getPropValue(propName);
        let timeMarker = this.activeTimeLine.getTimeMarkerAt(this.timePos);
        this.activeTimeMarkers = this.activeTimeLine.timeMarkers;

        this.activeTimeLine.insertShapePropValueAt(
            timeMarker, shape, propName, propValue, null);
    }

    moveToTime(t) {
        this.timePos = t;
        this.activeTimeLine.moveTo(this.timePos);
        this.activeScene.reUpdate();
    }

    isActiveScene(scene: Scene) {
        return this.activeScene && this.activeScene.equals(scene);
    }
}
