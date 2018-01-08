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

    toText() {
        return [this.red, this.green, this.blue, this.alpha].join(",");
    }

    static createFromHtml(text:String) {
        text = text.substr(1);
        let red = text.length>1 ? parseInt(text.substr(0, 2), 16)/255.0 : 1;
        let green = text.length>3 ? parseInt(text.substr(2, 2), 16)/255.0 : 1;
        let blue = text.length>5 ? parseInt(text.substr(4, 2), 16)/255.0 : 1;
        let alpha = text.length>6 ? parseInt(text.substr(6, 2), 16)/255.0 : 1;
        return new Color(red, green, blue, alpha);
    }

    static parse(data) {
        let color = new Color(1, 1, 1, 1);
        if (typeof(data) == "string") {
            let arr:any[] = data.split(",");
            for(let i=0; i<arr.length; i++) {
                arr[i] = parseFloat(arr[i]);
            }
            color.red = arr[0];
            color.green = arr[1];
            color.blue   = arr[2];
            color.alpha = arr[3];
        }
        return color;
    }
}

export function parseColor(item:any) {
    if (!item) return null;
    if (typeof item == "string") {
        if (item.substr(0,1) == "#") {
            return Color.createFromHtml(item);
        } else {
            return Color.parse(item);
        }
    }
    if (item instanceof Color) {
        return item.copy();
    }
}
