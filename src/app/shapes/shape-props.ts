import { Point } from '../commons';

export class ShapeProp {
    propName: string;

    constructor(propName:string) {
        this.propName = propName;
    }

    getTypeName():string {
        return null;
    }

    parseValue(value) {
        return value;
    }

    getFormattedValue(value) {
        if(value == null) return "";
        return value.toString();
    }
}

export class FloatShapeProp extends ShapeProp {
    static TypeName:string = "float";

    constructor(propName:string, public digits=2) {
        super(propName);
    }

    getTypeName():string {
        return FloatShapeProp.TypeName;
    }

    parseValue(value) {
        return parseFloat(value);
    }

    getFormattedValue(value) {
        if(value) return value.toFixed(3).toString();
        return "0";
    }
}

export class IntegerShapeProp extends ShapeProp {
    static TypeName:string = "integer";

    getTypeName():string {
        return IntegerShapeProp.TypeName;
    }

    parseValue(value) {
        return parseInt(value);
    }

    getFormattedValue(value) {
        if(value) return value.toFixed(0).toString();
        return "0";
    }
}

export class PointShapeProp extends ShapeProp {
    static TypeName:string = "point";

    getTypeName():string {
        return PointShapeProp.TypeName;
    }

    parseValue(value) {
        return Point.parse(value);
    }

    getFormattedValue(value) {
        return value.toText(2);
    }
}

export class TextShapeProp extends ShapeProp {
    static TypeName:string = "text";

    constructor(propName:string, public multiline=false) {
        super(propName);
    }

    getTypeName():string {
        return TextShapeProp.TypeName;
    }
}

export class ListShapeProp extends ShapeProp {
    static TypeName:string = "list";

    constructor(propName:string, public options:any[]) {
        super(propName);
    }

    getTypeName():string {
        return ListShapeProp.TypeName;
    }

    parseValue(value) {
        for(let item of this.options) {
            if(item instanceof Array) {
                if (item[1] == value) return item[1];
            }
        }
        return super.parseValue(value);
    }

    getFormattedValue(value) {
        for(let item of this.options) {
            if(item instanceof Array) {
                if (item[0] == value) return item[1];
            }
        }
        return super.getFormattedValue(value);
    }
}
