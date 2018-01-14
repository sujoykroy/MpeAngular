export class TimeMarker {
    static IdSeed:number = 0;
    idNum:number;

    constructor(private at:number,
                private text:string) {
        this.idNum = ++TimeMarker.IdSeed;
    }

    getAt() {
        return this.at;
    }

    setAt(t) {
        this.at = t;
    }

    static compare(tm1, tm2) {
        return tm1.at - tm2.at;
    }
}
