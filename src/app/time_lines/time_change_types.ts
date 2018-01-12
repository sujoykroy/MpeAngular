import { Point } from '../commons';

export class TimeChangeType {
    valueAt(startValue, endValue, t, duration) {
        duration = parseFloat(duration);
        if (duration == 0) {
            return startValue;
        }
        if (startValue instanceof Array) {
            let value = [];
            for (let i=0; i<startValue.length; i++) {
                value.push(startValue[i] + (endValue[i] - startValue[i])*t/duration);
            }
            return value;
        } else if (startValue instanceof Point) {
            let point = new Point(0, 0);
            point.x = startValue.x + (endValue.x-startValue.x)*t/duration;
            point.y = startValue.y + (endValue.y-startValue.y)*t/duration;
            return point;
        }
        return (startValue + (endValue - startValue)*t/duration);
    }

    getMinMaxValue(startValue, endValue, duration) {
        if (startValue instanceof Point) {
            startValue = [startValue.x, startValue.y];
            endValue = [endValue.x, endValue.y];
        }
        if (startValue instanceof Array) {
            let minv = null;
            let maxv = null;
            for (let i=0; i<Math.min(startValue.length, endValue.length); i++) {
                let minvl = Math.min(startValue[i], endValue[i]);
                let maxvl = Math.max(startValue[i], endValue[i]);
                if (minv != null) {
                    minv = Math.min(minvl, minv);
                } else {
                    minv = minvl;
                }
                if (minv != null) {
                    maxv = Math.max(maxvl, maxv);
                } else {
                    maxv = maxvl;
                }
            }
            return [minv, maxv];
        }
        return [Math.min(startValue, endValue), Math.max(startValue, endValue)];
    }
}

export class PeriodicChangeType extends TimeChangeType {
    period:number;
    damp:number = 0;
    freqDamp:number = 0;

    constructor(protected amplitude, period, protected phase) {
        super();
        this.period = parseFloat(period);
    }

    setPeriod(period) {
        if (period<=0) {
            period= 0.00001;
        }
        this.period = period;
    }

    selfValueAt(t) {
        return 0
    }

    valueAt(startValue, endValue, t, duration) {
        let value = super.valueAt(startValue, endValue, t, duration);
        let selfValue = this.selfValueAt(t)* Math.exp(-this.damp*t)

        if (value instanceof Array) {
            for (let i=0; i<value.length; i++) {
                value[i] += selfValue;
            }
        }else if (value instanceof Point) {
            value.translate(selfValue, selfValue);
        } else {
            value = value + selfValue;
        }
        return value;
    }

    getMinMaxValue(startValue, endValue, duration) {
        let minv = null;
        let maxv = null;
        if (startValue instanceof Point) {
            startValue = [startValue.x, startValue.y];
            endValue = [endValue.x, endValue.y];
        }
        if (startValue instanceof Array) {
            for (let i=0; i<startValue.length; i++) {
                let minvl = Math.min(startValue[i]-this.amplitude, endValue[i]-this.amplitude);
                let maxvl = Math.max(startValue[i]+this.amplitude, endValue[i]+this.amplitude);
                if (minv != null) {
                    minv = Math.min(minvl, minv);
                } else {
                    minv = minvl;
                }
                if (minv != null) {
                    maxv = Math.max(maxvl, maxv);
                } else {
                    maxv = maxvl;
                }
            }
            return [minv, maxv];
        } else {
            minv = Math.min(startValue-this.amplitude, endValue-this.amplitude);
            maxv = Math.max(startValue+this.amplitude, endValue+this.amplitude);
        }
        return [minv, maxv];
    }
}

export class SineChangeType extends PeriodicChangeType {

    selfValueAt(t) {
        let freqMult = 1;
        if (this.freqDamp != 0) {
            freqMult = Math.exp(-this.freqDamp*t);
        }
        let value = this.amplitude*Math.sin(
                Math.PI*2*freqMult*t/this.period + this.phase*Math.PI/180);
        return value;
    }

}

export class TriangleChangeType extends PeriodicChangeType {
    selfValueAt(t) {
        let frac = t/this.period;

        let freqMult = 1;
        if (this.freqDamp != 0) {
            freqMult = Math.exp(-this.freqDamp*t);
        }

        frac *= freqMult;
        frac = frac + this.phase/360;
        frac = frac % 1;

        if (frac>0.5) frac = 1-frac;
        frac = frac * 2;
        return this.amplitude*frac;
    }
}

export class SawtoothChangeType extends PeriodicChangeType {
    selfValueAt(t) {
        let frac = t/this.period;
        let freqMult = 1

        if (this.freqDamp != 0) {
            freqMult = Math.exp(-this.freqDamp*t);
        }
        frac *= freqMult;
        frac = frac + this.phase/360;
        frac = frac % 1;
        return this.amplitude*frac;
    }
}

export class LoopChangeType extends TimeChangeType {
    constructor(private loopCount=1) {
        super();
    }

    valueAt(startValue, endValue, t, duration) {
        let loopDuration = duration/this.loopCount;

        t = t % loopDuration;
        return super.valueAt(startValue, endValue, t, loopDuration);
    }
}
