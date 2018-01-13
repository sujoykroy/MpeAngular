import { Point } from '../commons';
import { Scene } from './scene';
import { RectangleShape } from '../shapes/rectangle-shape';

describe("scene", () => {
    it("should allow shape property insertion", ()=>{
        let scene = new Scene(new Point(100, 100));
        scene.duration = 100;

        let shape1 = RectangleShape.create(10,10);
        scene.addShape(shape1);
        shape1.moveTo(new Point(0, 0));

        scene.insertShapePropValue(shape1, "xy")
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
        expect(firstTimeSlice.duration).toBe(100);

        //first move
        scene.moveTo(10);
        shape1.moveTo(new Point(10, 20));
        scene.insertShapePropValue(shape1, "xy");

        let firstTimeSlice = xyPropLine.timeSlices.getItemAtIndex(0);

        expect(xyPropLine.timeSlices.length).toBe(2);

        expect(firstTimeSlice.startValue.x).toBe(0);
        expect(firstTimeSlice.startValue.y).toBe(0);
        expect(firstTimeSlice.endValue.x).toBe(10);
        expect(firstTimeSlice.endValue.y).toBe(20);
        expect(firstTimeSlice.duration).toBe(10);

        let secondTimeSlice = xyPropLine.timeSlices.getItemAtIndex(1);
        expect(secondTimeSlice.startValue.x).toBe(10);
        expect(secondTimeSlice.startValue.y).toBe(20);
        expect(secondTimeSlice.endValue.x).toBe(10);
        expect(secondTimeSlice.endValue.y).toBe(20);
        expect(secondTimeSlice.duration).toBe(90);


        //second move
        scene.moveTo(30);
        shape1.moveTo(new Point(30, 40));
        scene.insertShapePropValue(shape1, "xy");

        let firstTimeSlice = xyPropLine.timeSlices.getItemAtIndex(0);

        expect(xyPropLine.timeSlices.length).toBe(3);

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

        let thirdTimeSlice = xyPropLine.timeSlices.getItemAtIndex(2);
        expect(thirdTimeSlice.startValue.x).toBe(30);
        expect(thirdTimeSlice.startValue.y).toBe(40);
        expect(thirdTimeSlice.endValue.x).toBe(30);
        expect(thirdTimeSlice.endValue.y).toBe(40);
        expect(thirdTimeSlice.duration).toBe(70);

    })
});
