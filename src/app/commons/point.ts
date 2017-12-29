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
        let angleRad = angleDeg*Math.PI/180.;
        let x = this.x*Math.cos(angleRad)+this.y*Math.sin(angleRad);
        let y = -this.x*Math.sin(angleRad)+this.y*Math.cos(angleRad);
        this.x = x;
        this.y = y;
    }
}
