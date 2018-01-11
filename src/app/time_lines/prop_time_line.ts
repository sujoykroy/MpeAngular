import { TimeSlice } from './time_slice';
import { OrderedDict, copyObject } from '../commons';

export class PropTimeLine {
    timeSlices: OrderedDict;

    constructor(private shape, private propName) {
        this.timeSlices = new OrderedDict();
    }

    isTimeSliceLinkable() {
        if (this.propName in ['internal', "time_pos"]) {
            return false;
        }
        if (this.propName.startswith("pose_")) {
            return false;
        }
        return true;
    }

    insertTimeSliceAt(t, timeSlice) {
        if (this.timeSlices.length == 0) {
            timeSlice.duration += t
            this.timeSlices.add(timeSlice.id, timeSlice);
            return
        }
        if (t == 0) return;

        let elapsed = 0;
        let inserted = false;
        let prevTimeSlice = null;

        for (let i=0; i<this.timeSlices.length; i++) {
            let existTimeSlice = this.timeSlices.getItemAtIndex(0);
            if (t<elapsed+existTimeSlice.duration) {
                let remainingTime = elapsed+existTimeSlice.duration-t;
                if (remainingTime>1/25.) {
                    existTimeSlice.duration = t - elapsed;
                    timeSlice.duration = remainingTime;
                    if (this.isTimeSliceLinkable()) {
                        existTimeSlice.endValue = timeSlice.startValue;
                        existTimeSlice.linkedToNext = true;
                        timeSlice.linkedToNext = true;
                    }
                    timeSlice.endMarker = existTimeSlice.endMarker;
                    existTimeSlice.endMarker = null;
                    this.timeSlices.insertAfter(existTimeSlice, timeSlice.id, timeSlice);
                }
                inserted = true;
                break;
            }
            elapsed += existTimeSlice.duration;
            prevTimeSlice = existTimeSlice;
        }
        if (!inserted) {
            let lastTimeSlice = this.timeSlices.getLastItem();
            let lastValue = lastTimeSlice.valueAt(lastTimeSlice.duration);
            let propData = copyObject(lastTimeSlice.propData);
            let interTimeSlice = new TimeSlice(
                    lastValue, timeSlice.startValue, t-elapsed, propData);
            if (this.isTimeSliceLinkable()) {
                lastTimeSlice.linkedToNext = true;
                interTimeSlice.linkedToNext = true;
                timeSlice.linkedToNext = true;
            }
            this.timeSlices.insertAfter(lastTimeSlice, interTimeSlice.id, interTimeSlice);
            this.timeSlices.insertAfter(interTimeSlice, timeSlice.id, timeSlice);
        }
    }
}
