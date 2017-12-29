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
            if (vals[i].length<2) {
                vals[i] = "0" + vals[i];
            }
        }
        return "#" + vals.join("");
    }

    static createFromHtml(text:String) {
        text = text.substr(1);
        let red = text.length>1 ? parseInt(text.substr(0, 2), 16)/255.0 : 1;
        let green = text.length>3 ? parseInt(text.substr(2, 2), 16)/255.0 : 1;
        let blue = text.length>5 ? parseInt(text.substr(4, 2), 16)/255.0 : 1;
        let alpha = text.length>6 ? parseInt(text.substr(6, 2), 16)/255.0 : 1;
        return new Color(red, green, blue, alpha);
    }
}

export function parseColor(item:any) {
    if (!item) return item;
    if (typeof item == "string") {
        if (item.substr(0,1) == "#") {
            return Color.createFromHtml(item);
        }
    }
    if (item instanceof Color) {
        return item.copy();
    }
}
