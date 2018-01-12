import { OrderedDict } from '../commons';
import { PropTimeLine } from './prop_time_line';

export class ShapeTimeLine {
    propTimeLines: OrderedDict;

    constructor(public shape) {
        this.propTimeLines = new OrderedDict();
    }

    insertPropValueAt(t, propName, propValue, propData, maxDuration) {
        let propTimeLine;
        if (!this.propTimeLines.keyExists(propName)) {
            propTimeLine = new PropTimeLine(this.shape, propName);
            this.propTimeLines.add(propName, propTimeLine);
        } else {
            propTimeLine = this.propTimeLines.getItem(propName);
        }
        propTimeLine.insertValueAt(t, propValue, propData, maxDuration);
    }

    moveTo(t) {
        for (let key of this.propTimeLines.keys) {
            this.propTimeLines.getItem(key).moveTo(t);
        }
    }
}
