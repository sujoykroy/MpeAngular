import { Point } from './point';

const SVGNameSpace = "http://www.w3.org/2000/svg";

function numberSort(a,b) {
    return a-b;
}

export class SVGNode {
    domElement: Element;
    styles:any = {};

    constructor (tagName) {
        this.domElement = document.createElementNS(SVGNameSpace, tagName);
    }

    static getSVGId(idNum) {
        return "svgi" + idNum.toString();
    }

    setParam(param, value) {
        if (param == "id") {
            value = SVGNode.getSVGId(value);
        }
        this.domElement.setAttributeNS(SVGNameSpace, param, value);
    }

    addChild(child) {
        if (child instanceof SVGAnim) {
            this.domElement.appendChild(child.getStyle());
        }else if (child instanceof SVGNode) {
            this.domElement.appendChild(child.domElement);
        } else {
            this.domElement.appendChild(child);
        }
    }

    transform(offset=null, angle=null, transformOrigin=null, scale=null) {
        let items = [];
        if(offset != null) {
            let translateText = offset.x.toString() + "px, " + offset.y.toString() + "px";
            items.push("translate(" + translateText + ")");
        }
        if (angle != null) {
            let rotateText = angle.toString();
            items.push("rotate(" + rotateText + "deg)");
        }
        if (scale != null) {
            items.push("scale(" + scale + ")");
        }
        let styles:string[] = [];
        if (items.length>0) {
            this.styles.transform = items.join(" ");
        }
        if (transformOrigin) {
            this.styles["transform-origin"] = transformOrigin.x+"px "+transformOrigin.y+"px";
        }
        this._buildStyles();
    }

    setStyle(param, value) {
        this.styles[param] = value;
        this._buildStyles();
    }

    _buildStyles() {
        let styles = [];
        for(let key of Object.keys(this.styles)) {
            styles.push(key + ":" + this.styles[key]);
        }
        this.domElement.setAttributeNS(SVGNameSpace, "style", styles.join(";"));
    }
}

export class SVGAnim {
    shapeIdNumTimePosPropValues = {};
    delay:number = 0;

    constructor(private rootIdNum:string=null) {}

    add(shapeIdNum, timePos, paramValues:any) {
        if (!(shapeIdNum in this.shapeIdNumTimePosPropValues)) {
            this.shapeIdNumTimePosPropValues[shapeIdNum] = {};
        }
        let thisTimePosPropValues = this.shapeIdNumTimePosPropValues[shapeIdNum];

        if (!(timePos in thisTimePosPropValues)) {
            thisTimePosPropValues[timePos] = paramValues;
            return;
        }
        let thisParamValues = thisTimePosPropValues[timePos];
        for(let param of Object.keys(paramValues)) {
            if (param == "transform") {
                thisParamValues[param] = thisParamValues[param] + " " + paramValues[param];
            } else {
                thisParamValues[param] = paramValues[param];
            }
        }
    }

    addShapeIdNumPropValues(timePos, shapeIdNumParamValues:any) {
        for(let shapeIdNum of Object.keys(shapeIdNumParamValues)) {
            this.add(shapeIdNum, timePos, shapeIdNumParamValues[shapeIdNum]);
        }
    }

    merge(other:SVGAnim) {
        for(let shapeIdNum of Object.keys(other.shapeIdNumTimePosPropValues)) {
            let otherTimePosPropValues = other.shapeIdNumTimePosPropValues[shapeIdNum];
            for(let timePos of Object.keys(otherTimePosPropValues)) {
                this.add(shapeIdNum, timePos, otherTimePosPropValues[timePos]);
            }
        }
    }

    getMaxTime() {
        let fullTime:any = 0;
        for(let shapeIdNum of Object.keys(this.shapeIdNumTimePosPropValues)) {
            let timePosPropValues = this.shapeIdNumTimePosPropValues[shapeIdNum];
            let timePosValues = Object.keys(timePosPropValues);
            timePosValues.sort(numberSort);
            let maxTime:any = timePosValues[timePosValues.length-1];
            if (fullTime<maxTime) {
                fullTime = maxTime;
            }
        }
        return fullTime;
    }

    getStyle() {
        let animStringArray:string[] = [];
        let fullTime:any = this.getMaxTime();

        for(let shapeIdNum of Object.keys(this.shapeIdNumTimePosPropValues)) {
            let timePosPropValues = this.shapeIdNumTimePosPropValues[shapeIdNum];
            let timePosValues:any[] = Object.keys(timePosPropValues);
            timePosValues.sort(numberSort);

            let keyframes:string[] = [];
            let timePercent:any = 0;
            let keyframeString:string = "";

            for(let i=0; i<timePosValues.length; i++) {
                let timePos = timePosValues[i];
                let propValues:any = timePosPropValues[timePos];
                let transform:string = "";
                if ("xy" in propValues) {
                    transform += "translate("+ propValues.xy.x + "px, " + propValues.xy.y + "px) ";
                    delete propValues.xy;
                }
                if ("angle" in propValues) {
                    transform += "rotate("+  propValues.angle + "deg) ";
                    delete propValues.angle;
                }
                if ("anchor" in propValues) {
                    transform += "transform-origin("+ propValues.anchor.x + "px, "
                                + propValues.anchor.y + "px) ";
                }
                if (transform) {
                    propValues.transform = transform;
                }
            }

            for(let i=0; i<timePosValues.length; i++) {
                let timePos = timePosValues[i];
                let propStringArray:any[] = [];
                let propValues:any = timePosPropValues[timePos];
                for(let prop of Object.keys(propValues)) {
                    let propValue:any = propValues[prop];
                    if(propValue instanceof Point) {
                        continue
                    }
                    if (prop == "width" || prop == "height") {
                        propValue = propValue + "px";
                    }
                    propStringArray.push(prop + ":" + propValue.toString());
                }
                timePercent = 100*parseFloat(timePos)/fullTime;
                keyframeString = " {" + propStringArray.join(";") + "}";
                keyframes.push(timePercent + "% " + keyframeString);
            }


            if (timePercent<100) {
                keyframes.push("100% " + keyframeString);
            }
            let animName = "svgAnim" + shapeIdNum;
            let shapeAnimText:string = "@keyframes " + animName + "{\n" +
                                         keyframes.join("\n") + "}";
            animStringArray.push(shapeAnimText);
            animStringArray.push(
                    "#" + SVGNode.getSVGId(shapeIdNum) +" {\n " +
                    "   animation-name: " + animName + ";\n" +
                    "   animation-duration: " + fullTime + "s;\n" +
                    "   animation-timing-function: linear;\n" +
                    "   animation-delay: "+this.delay+"s;\n" +
                    "   animation-fill-mode: forwards;\n}"
            );
        }
        let animName = "svgAnimRoot" + this.rootIdNum;
        animStringArray.push(
                "@keyframes " + animName +" {\n " +
                "   0% {visibility: visible;}\n" +
                "   animation-name: " + animName + ";\n" +
                "   100% {visibility: hidden;}\n" +
                " }"
        )
        animStringArray.push(
                "#" + SVGNode.getSVGId(this.rootIdNum) +" {\n " +
                "   visibility: hidden;\n" +
                "   animation-name: " + animName + ";\n" +
                "   animation-duration: " + fullTime + "s;\n" +
                "   animation-timing-function: linear;\n" +
                "   animation-delay: "+this.delay+"s;\n" +
                "   animation-fill-mode: forwards;\n}" +
                " }"
        );

        let styleTag:any = document.createElement("style");
        styleTag.innerHTML = animStringArray.join("\n");
        return styleTag;
    }
}

