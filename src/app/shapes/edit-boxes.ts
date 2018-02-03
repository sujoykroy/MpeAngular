import { Point, Color, drawRoundedRectangle } from '../commons';

export class EditBox {
    borderWidth:number = 1;
    center:Point;
    name: string;
    offset:Point;

    constructor(name:string, offset:number[], private borderColor:Color, private fillColor:Color) {
        this.center = new Point(0, 0);
        this.name = name;
        this.offset = new Point(offset[0], offset[1]);
    }

    setFillColor(color:Color) {
        this.fillColor = color;
    }

    setCenter(point: Point) {
        this.center.copyFrom(point);
        this.center.translate(this.offset.x, this.offset.y);
    }

    isWithin(point:Point, rotateAngle:number=0) { return false; }

    drawPath(ctx, rotateAngle=0) {}

    drawBorder(ctx) {
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor.getStyleValue();
        ctx.stroke();
    }

    drawFill(ctx) {
        ctx.fillStyle = this.fillColor.getStyleValue();
        ctx.fill();
    }

    equals(other: EditBox) {
        return this.name == other.name;
    }
}

export class RectangleEditBox extends EditBox {
    constructor(name:string, offset:number[],
                borderColor:Color, fillColor:Color,
                private angle:number, private width:number, private height:number) {
        super(name, offset, borderColor, fillColor);
    }

    isWithin(point:Point, rotateAngle) {
        point = point.copy();
        point.translate(-this.center.x, -this.center.y);
        point.rotateCoordinate(rotateAngle+this.angle);
        return point.x >= -this.width*0.5 &&
               point.x <= this.width*0.5 &&
               point.y >= -this.height*0.5 &&
               point.y <= this.height*0.5;
    }

    drawPath(ctx, rotateAngle) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate((rotateAngle+this.angle)*Math.PI/180);
        drawRoundedRectangle(ctx,-this.width*0.5, -this.height*0.5, this.width, this.height);
        ctx.restore();
    }
}

export class OvalEditBox extends EditBox {
    constructor(name:string, offset:number[],
                borderColor:Color, fillColor:Color, private radius:number) {
        super(name, offset, borderColor, fillColor);
    }

    isWithin(point:Point, rotateAngle:number=0) {
        return this.center.distance(point)<=this.radius;
    }

    drawPath(ctx, rotateAngle=0) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2);
    }
}
