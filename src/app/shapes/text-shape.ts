import { RectangleShape } from './rectangle-shape';
import { Color, parseColor } from '../commons';

class FontDescription {
    fontSize:string;
    fontFamily:string;
    desc:string;
    constructor(desc:string) {
        let arr = desc.split(" ");
        this.fontSize = arr[arr.length-1] + "pt";
        if (arr.length>1) {
            arr.splice(-1);
            this.fontFamily = arr.join(" ");
        }
        this.desc = this.fontSize + " " + this.fontFamily;
    }

    getWidthPixel() {
        let layout = new TextLayout();
        layout.setText("T");
        layout.setFontDescription(this);
        let width = layout.getWidth();
        layout.cleanup()
        return width;
    }
}

class TextLayout {
    domElem;
    text:string;
    static HorizAlignment = {left: 0, center: 1, right: 2};
    static VertAlignment = {top:0, middle: 1, bottom: 2};

    constructor() {
        this.domElem = document.createElement("span");
        document.body.appendChild(this.domElem);
    }

    cleanup() {
        document.body.removeChild(this.domElem);
    }

    setFontDescription(fontDesc) {
        this.domElem.style.fontSize = fontDesc.fontSize;
        this.domElem.style.fontFamily = fontDesc.fontFamily;
    }

    setText(text) {
        this.text = text;
        this.domElem.innerText = text;
    }

    setWidth(width:number) {
        this.domElem.style.width = width + "px";
    }

    getWidth() {
        return this.domElem.offsetWidth;
    }

    getHeight() {
        return this.domElem.offsetHeight;
    }

    setAlignment(alignment) {
        this.domElem.style.textAlignment = TextLayout.HorizAlignment[alignment];
    }
}

export class TextShape extends RectangleShape {
    static TypeName = "text";

    xAlign:number;
    yAlign:number;
    text:string;
    displayText: string;
    exposure: number;
    font:string;
    fontColor: Color;
    lineAlign:number;
    maxWidthChars:number;

    fontDesc: FontDescription;

    static createFromJson(jsonData) {
        let newOb = new TextShape(null, null, null, 0, 0, 0);
        newOb.copyFromJson(jsonData);
        newOb.text = jsonData.text;
        newOb.setFont(jsonData.font);
        newOb.setExposure(jsonData.exposure);
        newOb.fontColor = parseColor(jsonData.font_color);
        newOb.lineAlign = jsonData.line_align;
        newOb.maxWidthChars = parseInt(jsonData.max_width_chars);
        newOb.xAlign = parseInt(jsonData.x_align);
        newOb.yAlign = parseInt(jsonData.y_align);
        return newOb;
    }

    getTypeName() {
        return TextShape.TypeName;
    }

    toJsonOb() {
        let jsonOb = super.toJsonOb();
        jsonOb.text = this.text;
        jsonOb.type = "text";
        jsonOb.font = this.font;
        jsonOb.exposure = this.exposure;
        jsonOb.font_color = this.fontColor.toText();
        jsonOb.line_align = this.lineAlign;
        jsonOb.max_width_chars = this.maxWidthChars;
        jsonOb.x_align = this.xAlign;
        jsonOb.y_align = this.yAlign;
        return jsonOb;
    }

    setFont(font) {
        this.font = font;
        this.fontDesc = new FontDescription(font);
    }

    setExposure(fraction:number) {
        this.exposure = fraction;
        let length:number = Math.abs(Math.floor(this.text.length*fraction))
        this.displayText = this.text.substr(0, length);
    }

    getTextLayout(text:string=null) {
        let layout = new TextLayout();
        layout.setFontDescription(this.fontDesc)

        if (!text) {
            text = this.displayText;
        }
        layout.setText(text)

        if (this.maxWidthChars>0) {
            let fontWidthPixel = this.fontDesc.getWidthPixel();
            layout.setWidth(this.maxWidthChars*fontWidthPixel);
        }
        let textWidth = layout.getWidth();
        let textHeight = layout.getHeight();

        let x,y;
        if (this.xAlign == TextLayout.HorizAlignment.left) {
            x = this.borderWidth+this.cornerRadius;
        } else if (this.xAlign == TextLayout.HorizAlignment.right) {
            x = this.width-textWidth-this.borderWidth-this.cornerRadius;
        } else if (this.xAlign == TextLayout.HorizAlignment.center) {
            x = (this.width-textWidth)*0.5;
        }
        if (this.yAlign == TextLayout.VertAlignment.top) {
            y = this.borderWidth+this.cornerRadius;
        } else if (this.yAlign == TextLayout.VertAlignment.bottom) {
            y = this.height-textHeight-this.borderWidth-this.cornerRadius;
        } else if (this.yAlign == TextLayout.VertAlignment.middle) {
            y = (this.height-textHeight)*0.5;
        }

        layout.setAlignment(this.lineAlign);

        return {layout:layout, x:x, y:y};
    }

    drawText(ctx) {
        let lf = this.getTextLayout();
        ctx.font = this.fontDesc.desc;
        ctx.textBaseline = "top";
        ctx.fillStyle = this.fontColor.getStyleValue();
        ctx.fillText(lf.layout.text, lf.x, lf.y);
        lf.layout.cleanup();
    }
}
