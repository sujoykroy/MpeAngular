import { Injectable } from '@angular/core';
import { Scene } from './scene';
import { Point, SVGNode } from '../commons';
import { TimeMarker } from '../time-lines/time-marker';
import { Shape } from '../shapes/shape';
import { ShapeProp } from '../shapes/shape-props';

@Injectable()
export class SceneService {
    scenes: Scene[] = [];
    sceneSize:Point = new Point(1280, 720);

    activeScene:Scene;
    activeTimeLine;
    activeTimeMarkers: TimeMarker[] = [];
    activeShape:Shape;
    shapeProps:ShapeProp[] = [];

    createMode = null;

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
        this.startShapeCreation(null);
        this.activeScene = scene;
        this.activeTimeLine = scene.getMainTimeLine();
        this.activeTimeMarkers = this.activeTimeLine.timeMarkers;
    }


    startShapeCreation(shapeTypeName) {
        this.createMode = shapeTypeName
    }

    setActiveShape(shape:Shape) {
        this.activeShape = shape;
        if(this.activeShape) {
            this.shapeProps = this.activeShape.getShapeProps();
        } else {
            this.shapeProps = [];
        }
    }

    setActiveShapePropValue(propName, propValue) {
        if(!this.activeShape) return;
        this.activeShape.setPropValue(propName, propValue, null);
        this.insertShapePropValue(this.activeShape, propName);
        this.activeScene.reUpdate();
    }

    getActiveShapePropValue(propName) {
        if(!this.activeShape) return null;
        return this.activeShape.getPropValue(propName);
    }

    insertShapePropValue(shape, propName) {
        let propValue = shape.getPropValue(propName);
        let timeMarker = this.activeTimeLine.getTimeMarkerAt(this.timePos);
        this.activeTimeMarkers = this.activeTimeLine.timeMarkers;

        this.activeTimeLine.insertShapePropValueAt(
            timeMarker, shape, propName, propValue, null);
    }

    addShape(shape:Shape) {
        this.activeScene.addShape(shape);
    }

    moveToTime(t) {
        this.timePos = t;
        this.activeTimeLine.moveTo(this.timePos);
        this.activeScene.reUpdate();
    }

    isActiveScene(scene: Scene) {
        return this.activeScene && this.activeScene.equals(scene);
    }

    getSVG(scale:number) {
        let svgNode = new SVGNode("svg");
        let viewBox = "0 0 " + this.sceneSize.x.toString() + " " + this.sceneSize.y.toString();
        svgNode.setParam("viewBox", viewBox);

        svgNode.setParam("width", this.sceneSize.x*scale);
        svgNode.setParam("height", this.sceneSize.y*scale);

        let elapsed:number =  0;
        let htmlData:string = "";
        for(let scene of this.scenes) {
            if (scene.containerShape.shapes.length == 0) continue;
            let sceneSvg:Element = scene.getSVG(scale, elapsed);
            htmlData += sceneSvg.innerHTML;
            elapsed += scene.duration;
        }
        svgNode.domElement.innerHTML = htmlData;
        return svgNode.domElement;
    }
}
