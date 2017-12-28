export class Color {
    red: number;
    green: number;
    blue: number;
    alpha: number;

    constructor(red:number, green:number, blue:number, alpha:number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    copy(): Color {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }

    getStyleValue() {
        let vals:any[] = [this.red*255, this.green*255, this.blue*255, this.alpha*255];
        for (let i=0; i<vals.length; i++) {
            vals[i] = Math.floor(vals[i]).toString(16);
        }
        return "#" + vals.join("");
    }
}
