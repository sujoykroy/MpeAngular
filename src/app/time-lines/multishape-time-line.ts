import { OrderedDict } from '../commons';
import { ShapeTimeLine } from './shape-time-line';
import { TimeSlice } from './time-slice';
import { TimeMarker } from './time-marker';

export class MultiShapeTimeLine {
    static TypeName = "multi_shape_time_line";

    shapeTimeLines: OrderedDict;
    duration:number = 0;
    timeMarkers:TimeMarker[];

    constructor(private name:string, private shape) {
        this.shapeTimeLines = new OrderedDict();
        this.timeMarkers = [];
    }

    toJsonOb() {
        let jsonOb:any = {};
        let shapeTimeLines = [];
        jsonOb[ShapeTimeLine.TypeName] = shapeTimeLines;
        for(let key of this.shapeTimeLines.keys) {
            shapeTimeLines.push(this.shapeTimeLines.getItem(key).toJsonOb());
        }
        return jsonOb;
    }

    getTimeMarkerAt(t) {
        let existTimeMarker = this.getClosestTimeMarker(t);
        if(existTimeMarker) {
            return existTimeMarker;
        }
        let timeMarker = new TimeMarker(t, t.toString());
        this.timeMarkers.push(timeMarker);
        this.timeMarkers.sort(TimeMarker.compare);
        return timeMarker;
    }

    getClosestTimeMarker(t:number, tolerance:number=1/30) {
        for (let tm of this.timeMarkers) {
            if (Math.abs(tm.getAt()-t)<=tolerance) {
                return tm;
            }
        }
        return null;
    }

    getTimeMarkerIndex(tm) {
        for (let i = 0; i<this.timeMarkers.length; i++) {
            if (tm.idNum == this.timeMarkers[i].idNum) return i;
        }
        return -1;
    }

    moveTimeMarkerTo(t, timeMarker) {
        let index = this.getTimeMarkerIndex(timeMarker);
        if (index>0 && this.timeMarkers[index-1]>t) {
            return false;
        }
        if (index>0 && this.timeMarkers[index-1]>t) {
            return false;
        }
        if (index<this.timeMarkers.length-1 && this.timeMarkers[index+1]<t) {
            return false;
        }
        timeMarker.setAt(t);
        return true;
    }

    insertShapePropValueAt(tm, shape, propName, propValue, propData) {
        let shapeTimeLine;
        if (!this.shapeTimeLines.keyExists(shape.idNum)) {
            shapeTimeLine = new ShapeTimeLine(shape);
            this.shapeTimeLines.add(shape.idNum, shapeTimeLine);
        } else {
            shapeTimeLine = this.shapeTimeLines.getItem(shape.idNum);
        }
        shapeTimeLine.insertPropValueAt(tm, propName, propValue, propData);
    }

    moveTo(t, forceVisible=true) {
        if (t<0) return;
        for (let key of this.shapeTimeLines.keys) {
            let shapeTimeLine = this.shapeTimeLines.getItem(key);
            if (forceVisible && shapeTimeLine.shape.renderable) {
                shapeTimeLine.shape.visible = true;
            }
            shapeTimeLine.moveTo(t);
        }
    }
}
