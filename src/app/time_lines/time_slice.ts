import {copyObject} from '../commons';

export class TimeSlice {
    static IdSeed:number = 0;

    id;
    startValue;
    endValue;
    linkedToNext = false;

    constructor(startValue, endValue, private duration,
                private changeType, private propData=null) {
        this.startValue = copyObject(startValue);
        this.endValue = copyObject(endValue);
        this.id = ++TimeSlice.IdSeed;
    }

    setStartValue(value) {
        this.startValue = copyObject(value);
    }

    setEndValue(value) {
        this.endValue = copyObject(value);
    }

    valueAt(t) {
        this.changeType.valueAt(this.startValue, this.endValue, t, this.duration);
    }
}
