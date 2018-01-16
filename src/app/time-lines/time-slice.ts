import {copyObject, createJsonOb } from '../commons';
import { TimeChangeType } from './time-change-types';

export class TimeSlice {
    static TypeName = "time_slice";
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
        if (typeof(this.startValue) === "string") {
            return this.startValue;
        }
        return this.changeType.valueAt(this.startValue, this.endValue, t, this.duration);
    }

    toJsonOb() {
        let jsonOb:any = {};
        jsonOb.start_value = createJsonOb(this.startValue);
        jsonOb.end_value = createJsonOb(this.endValue);
        jsonOb.duration = this.duration;
        jsonOb.changeType = this.changeType.getTypeName();
        if (this.propData) {
            jsonOb.propData = createJsonOb(this.propData);
        }
        jsonOb.linked_to_next = this.linkedToNext ? "True" : "False";
        return jsonOb;
    }
}
