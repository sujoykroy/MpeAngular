import { TestBed, inject } from '@angular/core/testing';

import { SceneService } from './scene.service';
import { MpFileService } from './mpfile.service';
import { HttpClientModule } from '@angular/common/http';

import { Point } from '../commons';
import { Scene } from './scene';
import { RectangleShape } from '../shapes/rectangle-shape';

describe('SceneService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule,],
            providers: [SceneService, MpFileService]
        });
    });

    it('should allow shape property insertion', inject([SceneService], (service: SceneService) => {
        let scene = service.scenes[0];

        let shape1 = RectangleShape.create(10,10);
        scene.addShape(shape1);
        shape1.moveTo(new Point(0, 0));

        service.insertShapePropValue(shape1, "xy")
        let timeline = scene.getMainTimeLine();

        let propTimeLines = timeline.shapeTimeLines.getItemAtIndex(0).propTimeLines;
        expect(propTimeLines).not.toBe(null);

        let xyPropLine = propTimeLines.getItem("xy");
        expect(xyPropLine.timeSlices.length).toBe(1);

        let firstTimeSlice = xyPropLine.timeSlices.getItemAtIndex(0);
        expect(firstTimeSlice.startValue.x).toBe(0);
        expect(firstTimeSlice.startValue.y).toBe(0);
        expect(firstTimeSlice.endValue.x).toBe(0);
        expect(firstTimeSlice.endValue.y).toBe(0);
        expect(firstTimeSlice.duration).toBe(0);

        //first move
        service.moveToTime(10);
        shape1.moveTo(new Point(10, 20));
        service.insertShapePropValue(shape1, "xy");

        firstTimeSlice = xyPropLine.timeSlices.getItemAtIndex(0);

        expect(xyPropLine.timeSlices.length).toBe(1);

        expect(firstTimeSlice.startValue.x).toBe(0);
        expect(firstTimeSlice.startValue.y).toBe(0);
        expect(firstTimeSlice.endValue.x).toBe(10);
        expect(firstTimeSlice.endValue.y).toBe(20);
        expect(firstTimeSlice.duration).toBe(10);

        //second move
        service.moveToTime(30);
        shape1.moveTo(new Point(30, 40));
        service.insertShapePropValue(shape1, "xy");

        firstTimeSlice = xyPropLine.timeSlices.getItemAtIndex(0);

        expect(xyPropLine.timeSlices.length).toBe(2);

        expect(firstTimeSlice.startValue.x).toBe(0);
        expect(firstTimeSlice.startValue.y).toBe(0);
        expect(firstTimeSlice.endValue.x).toBe(10);
        expect(firstTimeSlice.endValue.y).toBe(20);
        expect(firstTimeSlice.duration).toBe(10);

        let secondTimeSlice = xyPropLine.timeSlices.getItemAtIndex(1);
        expect(secondTimeSlice.startValue.x).toBe(10);
        expect(secondTimeSlice.startValue.y).toBe(20);
        expect(secondTimeSlice.endValue.x).toBe(30);
        expect(secondTimeSlice.endValue.y).toBe(40);
        expect(secondTimeSlice.duration).toBe(20);

        //third move
        service.moveToTime(20)
        shape1.moveTo(new Point(100, 200))
        service.insertShapePropValue(shape1, "xy");

        expect(xyPropLine.timeSlices.length).toBe(3);

        firstTimeSlice = xyPropLine.timeSlices.getItemAtIndex(0);
        expect(firstTimeSlice.startValue.x).toBe(0);
        expect(firstTimeSlice.startValue.y).toBe(0);
        expect(firstTimeSlice.endValue.x).toBe(10);
        expect(firstTimeSlice.endValue.y).toBe(20);
        expect(firstTimeSlice.duration).toBe(10);

        secondTimeSlice = xyPropLine.timeSlices.getItemAtIndex(1);
        expect(secondTimeSlice.startValue.x).toBe(10);
        expect(secondTimeSlice.startValue.y).toBe(20);
        expect(secondTimeSlice.endValue.x).toBe(100);
        expect(secondTimeSlice.endValue.y).toBe(200);
        expect(secondTimeSlice.duration).toBe(10);

        let thirdTimeSlice = xyPropLine.timeSlices.getItemAtIndex(2);
        expect(thirdTimeSlice.startValue.x).toBe(100);
        expect(thirdTimeSlice.startValue.y).toBe(200);
        expect(thirdTimeSlice.endValue.x).toBe(30);
        expect(thirdTimeSlice.endValue.y).toBe(40);
        expect(thirdTimeSlice.duration).toBe(10);

    }));
});
