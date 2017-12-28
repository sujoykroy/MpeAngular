export class Point {
    x:number;
    y: number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    copy():Point {
        return new Point(this.x, this.y);
    }
}
