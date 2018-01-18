import { OrderedDict, SVGNode, SVGAnim } from '../commons';
import { PropTimeLine } from './prop-time-line';

export class ShapeTimeLine {
    static TypeName = "shape_time_line";
    propTimeLines: OrderedDict;

    constructor(public shape) {
        this.propTimeLines = new OrderedDict();
    }

    toJsonOb() {
        let jsonOb:any = {};
        let propTimeLines = []
        jsonOb[PropTimeLine.TypeName] = propTimeLines;
        for(let key of this.propTimeLines.keys) {
            propTimeLines.push(this.propTimeLines.getItem(key).toJsonOb());
        }
        return jsonOb;
    }

    insertPropValueAt(tm, propName, propValue, propData) {
        let propTimeLine;
        if (!this.propTimeLines.keyExists(propName)) {
            propTimeLine = new PropTimeLine(this.shape, propName);
            this.propTimeLines.add(propName, propTimeLine);
        } else {
            propTimeLine = this.propTimeLines.getItem(propName);
        }
        propTimeLine.insertValueAt(tm, propValue, propData);
    }

    moveTo(t) {
        for (let key of this.propTimeLines.keys) {
            this.propTimeLines.getItem(key).moveTo(t);
        }
    }

    getSVGAnim() {
        let anim:SVGAnim = new SVGAnim();
        for (let i=0; i<this.propTimeLines.length; i++) {
            let propTimeLine = this.propTimeLines.getItemAtIndex(i);
            anim.merge(propTimeLine.getSVGAnim());
        }
        return anim;
    }
}
