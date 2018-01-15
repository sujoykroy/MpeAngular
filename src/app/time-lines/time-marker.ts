export class TimeMarker {
    static IdSeed:number = 0;
    idNum:number;

    constructor(private at:number,
                private text:string=null) {
        this.idNum = ++TimeMarker.IdSeed;
        if (!this.text) {
            this.text = this.idNum.toString();
        }
    }

    getAt() {
        return this.at;
    }

    setAt(t) {
        this.at = t;
    }

    getText() {
        return this.text;
    }

    setText(text) {
        this.text = text.toString();
    }

    static compare(tm1, tm2) {
        return tm1.at - tm2.at;
    }
}
