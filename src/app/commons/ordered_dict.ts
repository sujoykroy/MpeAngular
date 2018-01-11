export class OrderedDict {
    items = {};
    keys = [];
    length = 0;

    add(item, key=null) {
        if (key == null) {
            key = item;
        }
        if (!(key in this.keys)) {
            this.keys.push(key);
        }
        this.items[key] = item;
        this.length = this.keys.length;
    }

    remove(key) {
        if (key in this.keys) {
            let index = this.keys.indexOf(key);
            if (index>=0) {
                this.keys.splice(index, 1);
                delete this.items[key];
            }
        }
        this.length = this.keys.length;
    }

    getItem(key) {
        return this.items[key];
    }

    getItemAtIndex(index) {
        if (index<0) {
            index += this.keys.length;
        } else if (index>=this.keys.length) {
            return null;
        }
        return this.items[this.keys[index]];
    }

    getLastItem() {
        if (this.keys.length == 0) return null;
        return this.items[this.keys[this.keys.length-1]];
    }

    keyExists(key) {
        return this.keys.indexOf(key) >= 0;
    }

    insertAfter(afterKey, key, item) {
        if (!(afterKey in this.keys)) {
            this.add(key, item);
        } else {
            let index = this.keys.indexOf(afterKey);
            this.keys.splice(index, 0, key);
            this.items[key] = item;
        }
    }
}
