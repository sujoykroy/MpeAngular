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

    insertValueAt(t, propValue, propData, maxDuration, tolerance=2/25.0) {
        if (this.timeSlices.length == 0) {
            let timeSlice = new TimeSlice(propValue, propValue, maxDuration);
            this.timeSlices.add(timeSlice.id, timeSlice);
            return;
        }
        if (Math.abs(t) <= tolerance) {
            let timeSlice = this.timeSlices.getItemAtIndex(0);
            timeSlice.setStartValue(propValue);
            timeSlice.setPropData(propData);
            return;
        }

        let elapsed = 0;
        let inserted = false;
        let prevTimeSlice = null;

        for (let i=0; i<this.timeSlices.length; i++) {
            let existTimeSlice = this.timeSlices.getItemAtIndex(0);
            if (t<elapsed+existTimeSlice.duration) {
                let remainingTime = elapsed+existTimeSlice.duration-t;
                if (remainingTime>tolerance) {
                    existTimeSlice.duration = t - elapsed;
                    let timeSlice = new TimeSlice(propValue, propValue, remainingTime, null, propData);
                    if (this.isTimeSliceLinkable()) {
                        existTimeSlice.endValue = timeSlice.startValue;
                        existTimeSlice.linkedToNext = true;
                        timeSlice.linkedToNext = true;
                    }
                    timeSlice.endMarker = existTimeSlice.endMarker;
                    existTimeSlice.endMarker = null;
                    this.timeSlices.insertAfter(existTimeSlice.id, timeSlice.id, timeSlice);
                } else {
                    existTimeSlice.setEndValue(propValue);
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
                    lastValue, propValue, t-elapsed, propData);
            let timeSlice = new TimeSlice(propValue, propValue, maxDuration-t, null, propData);
            if (this.isTimeSliceLinkable()) {
                lastTimeSlice.linkedToNext = true;
                interTimeSlice.linkedToNext = true;
                timeSlice.linkedToNext = true;
            }
            this.timeSlices.insertAfter(lastTimeSlice.id, interTimeSlice.id, interTimeSlice);
            this.timeSlices.insertAfter(interTimeSlice.id, timeSlice.id, timeSlice);
        }
    }

    moveTo(t) {
        let elapsed = 0;
        for (let i=0; i<this.timeSlices.length; i++) {
            let timeSlice = this.timeSlices.getItemAtIndex(i);
            if (t<elapsed+timeSlice.duration || i==this.timeSlices.length-1) {
                if (t>elapsed+timeSlice.duration) {
                    t = elapsed+timeSlice.duration;
                }
                let value = timeSlice.valueAt(t - elapsed);
                this.shape.setPropValue(this.propName, value, timeSlice.propData);
                return;
            }
            elapsed += timeSlice.duration;
        }
    }
}
