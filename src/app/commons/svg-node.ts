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

