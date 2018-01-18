import { TimeSlice } from './time-slice';
import { OrderedDict, copyObject, SVGAnim } from '../commons';
import { TimeMarker } from './time-marker';

export class PropTimeLine {
    static TypeName = "prop_time_line";
    timeSlices: OrderedDict;

    constructor(private shape, private propName) {
        this.timeSlices = new OrderedDict();
    }

    toJsonOb() {
        let jsonOb:any = {};
        let timeSlices = [];
        jsonOb[TimeSlice.TypeName] = timeSlices;
        for(let key of this.timeSlices.keys) {
            timeSlices.push(this.timeSlices.getItem(key).toJsonOb());
        }
        return jsonOb;
    }

    isTimeSliceLinkable() {
        if (this.propName in ['internal', "time_pos"]) {
            return false;
        }
        if (this.propName.startsWith("pose_")) {
            return false;
        }
        return true;
    }

    insertValueAt(tm:TimeMarker, propValue, propData, tolerance=2/25.0) {
        let t:number = tm.getAt();
        let elapsed = 0;
        let inserted = false;
        let prevTimeSlice = null;

        let lastTimeSlice = this.timeSlices.getLastItem();
        if (lastTimeSlice && lastTimeSlice.duration == 0) {
            lastTimeSlice.setEndValue(propValue);
            lastTimeSlice.endMarker = tm;
            lastTimeSlice.duration = t;
            return;
        }

        for (let i=0; i<this.timeSlices.length; i++) {
            let existTimeSlice = this.timeSlices.getItemAtIndex(i);
            if (t<=elapsed+existTimeSlice.duration) {
                let remainingTime = elapsed+existTimeSlice.duration-t;
                if (remainingTime>tolerance) {
                    existTimeSlice.duration = t - elapsed;
                    let timeSlice = new TimeSlice(
                            propValue, existTimeSlice.endValue, remainingTime, null, propData);
                    if (this.isTimeSliceLinkable()) {
                        existTimeSlice.setEndValue(timeSlice.startValue);
                        existTimeSlice.linkedToNext = true;
                        timeSlice.linkedToNext = true;
                    }
                    timeSlice.endMarker = existTimeSlice.endMarker;
                    existTimeSlice.endMarker = tm;
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
            let startValue = propValue;
            let duration = t;
            if (lastTimeSlice) {
                duration = t-elapsed;
                startValue = lastTimeSlice.endValue;
            }
            let timeSlice = new TimeSlice(startValue, propValue, duration, null, propData);
            timeSlice.endMarker = tm;
            if (this.isTimeSliceLinkable()) {
                if(lastTimeSlice) {
                    lastTimeSlice.linkedToNext = true;
                }
                timeSlice.linkedToNext = true;
            }
            if (lastTimeSlice) {
                this.timeSlices.insertAfter(lastTimeSlice.id, timeSlice.id, timeSlice);
            } else {
                this.timeSlices.add(timeSlice.id, timeSlice);
            }
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

    getSVGAnim() {
        let anim:SVGAnim = new SVGAnim();
        let elapsed:number = 0;
        for (let i=0; i<this.timeSlices.length; i++) {
            let timeSlice = this.timeSlices.getItemAtIndex(i);
            anim.add(this.shape.idNum, elapsed,
                this.shape.getSVGAnimateValue(this.propName, timeSlice.startValue));

            elapsed += timeSlice.duration;
            if (i == this.timeSlices.length-1) {
                anim.add(this.shape.idNum, elapsed,
                    this.shape.getSVGAnimateValue(this.propName, timeSlice.endValue));
            }
        }
        return anim;
    }
}
