import { OrderedDict } from '../commons';
import { ShapeTimeLine } from './shape_time_line';

export class MultiShapeTimeLine {
    shapeTimeLines: OrderedDict;
    duration:number = 0;

    constructor(private name:string, private shape) {
        this.shapeTimeLines = new OrderedDict();
    }

    insertShapePropTimeSliceAt(t, shape, propName, timeSlice) {
        let shapeTimeLine;
        if (this.shapeTimeLines.keyExists(shape.id)) {
            shapeTimeLine = new ShapeTimeLine(shape);
            this.shapeTimeLines.add(shape.id, shapeTimeLine);
        } else {
            shapeTimeLine = this.shapeTimeLines.getItem(shape.id);
        }
        shapeTimeLine.insertPropTimeSliceAt(t, propName, timeSlice);
    }
}
