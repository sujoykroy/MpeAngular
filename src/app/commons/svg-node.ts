const SVGNameSpace = "http://www.w3.org/2000/svg";

export class SVGNode {
    domElement: Element;

    constructor (tagName) {
        this.domElement = document.createElementNS(SVGNameSpace, tagName);
    }

    setParam(param, value) {
        this.domElement.setAttributeNS(SVGNameSpace, param, value);
    }

    addChild(child) {
        this.domElement.appendChild(child.domElement);
    }

    transform(offset=null, angle=null, angleOrigin=null, scale=null) {
        let items = [];
        if(offset != null) {
            let translateText = offset.x.toString() + " " + offset.y.toString();
            items.push("translate(" + translateText + ")");
        }
        if (angle != null) {
            let rotateText = angle.toString();
            if (angleOrigin) {
                rotateText  += " " + angleOrigin.x.toString() + " " + angleOrigin.y.toString();
            };
            items.push("rotate(" + rotateText + ")");
        }
        if (scale != null) {
            items.push("scale(" + scale + ")");
        }
        this.domElement.setAttributeNS(SVGNameSpace, "transform", items.join(" "));
    }
}

export class SVGAnim {
    shapeIdNumTimePosPropValues = {};

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
            thisParamValues[param] = paramValues[param];
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

    getStyle() {
        let animStringArray:string[] = [];
        for(let shapeIdNum of Object.keys(this.shapeIdNumTimePosPropValues)) {
            let timePosPropValues = this.shapeIdNumTimePosPropValues[shapeIdNum];
            let timePosValues = Object.keys(timePosPropValues);
            timePosValues.sort();
            let maxTime:any = timePosValues[timePosValues.length-1];

            let keyframes:string[] = [];
            for(let timePos of Object.keys(timePosPropValues)) {
                let propStringArray:any[] = [];
                let propValues:any = timePosPropValues[timePos];
                for(let prop of Object.keys(propValues)) {
                    propStringArray.push(prop + ":" + propValues[prop].toString());
                }
                let timePercent:any = parseFloat(timePos)/maxTime;
                keyframes.push(timePercent + "% {" + propStringArray.join(";") + "}");
            }

            let shapeAnimText:string = "@keyframe svgAnim" + shapeIdNum + "{" +
                                         keyframes.join("\n") + "}";
            animStringArray.push(shapeAnimText);
        }
        let styleTag:any = document.createElement("style");
        styleTag.innerHTML = animStringArray.join("\n");
        return styleTag;
    }
}

