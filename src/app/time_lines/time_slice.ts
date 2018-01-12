import {copyObject} from '../commons';
import { TimeChangeType } from './time_change_types';

export class TimeSlice {
    static IdSeed:number = 0;

    id;
    startValue;
    endValue;
    linkedToNext = false;
    endMarker;
    changeType;

    constructor(startValue, endValue, private duration,
                changeType=null, private propData=null) {
        this.startValue = copyObject(startValue);
        this.endValue = copyObject(endValue);
        this.id = ++TimeSlice.IdSeed;
        if (!changeType) {
            this.changeType = new TimeChangeType();
        }
    }

    setStartValue(value) {
        this.startValue = copyObject(value);
    }

    setEndValue(value) {
        this.endValue = copyObject(value);
    }

    setPropData(value) {
        this.propData = copyObject(value);
    }

    valueAt(t) {
        return this.changeType.valueAt(this.startValue, this.endValue, t, this.duration);
    }
}
