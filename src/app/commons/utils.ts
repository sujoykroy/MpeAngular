export function copyObject(object) {
    if (!object) return object;
    if (!!object.copy) {
        return object.copy();
    } else if (typeof object == "object") {
        return Object.assign({}, object);
    }
    return object;
}

export function drawRoundedRectangle(ctx, x, y, w, h, r=0) {
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.lineTo(x+w-r,y);
    ctx.arcTo(x+w, y, x+w, y+r, r);
    ctx.lineTo(x+w, y+h-r);
    ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
    ctx.lineTo(x+w-r, y+h);
    ctx.arcTo(x, y+h, x, y+h-r, r);
    ctx.lineTo(x, y+r);
    ctx.arcTo(x, y, x+r, y, r);
    ctx.closePath();
}

export function createJsonOb(object) {
    if (!object) return object;
    if(!!object.toJsonOb) {
        return object.toJsonOb();
    }
    if(!!object.toText) {
        return object.toText();
    }
    if (object instanceof Array) {
        let result = [];
        for(let item of object) {
            result.push(createJsonOb(item));
        }
        return result;
    }
    if (object instanceof Object) {
        let result = {};
        for(let key of Object.keys(object)) {
            result[key] = createJsonOb(object[key]);
        }
        return result;
    }
    return object;
}
