export class Point {
    x: number;
    y: number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    copy():Point {
        return new Point(this.x, this.y);
    }

    scale(sx:number, sy:number) {
        this.x *= sx;
        this.y *= sy;
    }

    translate(dx:number, dy:number) {
        this.x += dx;
        this.y += dy;
    }

    rotateCoordinate(angleDeg:number) {
        let angleRad = angleDeg*Math.PI/180;
        let x = this.x*Math.cos(angleRad)+this.y*Math.sin(angleRad);
        let y = -this.x*Math.sin(angleRad)+this.y*Math.cos(angleRad);
        this.x = x;
        this.y = y;
    }

    assign(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    copyFrom(other: Point) {
        this.x = other.x;
        this.y = other.y;
    }

    diff(other: Point) {
        let diffPoint = this.copy();
        diffPoint.x -= other.x;
        diffPoint.y -= other.y;
        return diffPoint;
    }

    distance(other: Point) {
        let dx: number = this.x-other.x;
        let dy: number = this.y - other.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    getAngle() {
        return Math.atan2(this.y, this.x)*180/Math.PI;
    }
}
