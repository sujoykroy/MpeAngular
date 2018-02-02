import { Point } from './point';

export class Rectangle {
    constructor(public leftTop:Point, public rightBottom:Point) {}

    get width():number {
        return this.rightBottom.x-this.leftTop.x;
    }

    get height():number {
        return this.rightBottom.y-this.leftTop.y;
    }

    get centerX():number {
        return (this.leftTop.x+this.rightBottom.x)*0.5;
    }

    get centerY():number {
        return (this.leftTop.y+this.rightBottom.y)*0.5;
    }

    expandToInclude(point:Point) {
        if(point.x<this.leftTop.x) {
            this.leftTop.x = point.x;
        }else if(point.x>this.rightBottom.x) {
            this.rightBottom.x = point.x;
        }
        if(point.y<this.leftTop.y) {
            this.leftTop.y = point.y;
        } else if(point.y>this.rightBottom.y) {
            this.rightBottom.y = point.y;
        }
    }

    expandToIncludeRect(rect:Rectangle) {
        this.expandToInclude(rect.leftTop);
        this.expandToInclude(rect.rightBottom);
        this.expandToInclude(new Point(rect.leftTop.x, rect.rightBottom.y));
        this.expandToInclude(new Point(rect.rightBottom.x, rect.leftTop.y));
    }
}
