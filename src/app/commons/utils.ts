export function copyObject(object) {
    if (!object) return object;
    if (object.hasOwnProperty("copy")) {
        return object.copy();
    } else if (typeof object == "object") {
        return Object.assign({}, object);
    }
    return object;
}
