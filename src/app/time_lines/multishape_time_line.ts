import { OrderedDict } from '../commons';
import { ShapeTimeLine } from './shape_time_line';
import { TimeSlice } from './time_slice';

export class MultiShapeTimeLine {
    static TypeName = "multi_shape_time_line";

    shapeTimeLines: OrderedDict;
    duration:number = 0;

    constructor(private name:string, private shape) {
        this.shapeTimeLines = new OrderedDict();
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

    insertShapePropValueAt(t, shape, propName, propValue, propData, maxDuration) {
        let shapeTimeLine;
        if (!this.shapeTimeLines.keyExists(shape.idNum)) {
            shapeTimeLine = new ShapeTimeLine(shape);
            this.shapeTimeLines.add(shape.idNum, shapeTimeLine);
        } else {
            shapeTimeLine = this.shapeTimeLines.getItem(shape.idNum);
        }
        shapeTimeLine.insertPropValueAt(t, propName, propValue, propData, maxDuration);
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
