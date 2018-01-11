import { OrderedDict } from '../commons';
import { PropTimeLine } from './prop_time_line';

export class ShapeTimeLine {
    propTimeLines: OrderedDict;

    constructor(private shape) {
        this.propTimeLines = new OrderedDict();
    }

    insertPropTimeSliceAt(t, propName, timeSlice) {
        let propTimeLine;
        if (this.propTimeLines.keyExists(propName)) {
            propTimeLine = new PropTimeLine(this.shape, propName);
            this.propTimeLines.add(propName, propTimeLine);
        } else {
            propTimeLine = this.propTimeLines.getItem(propName);
        }
        propTimeLine.insertTimeSlice_at(t, timeSlice);
    }
}
