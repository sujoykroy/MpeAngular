import { Injectable } from '@angular/core';

function rgb2rgba(rgb_list) {
    let arr:string[] = [];
    for(let rgb of rgb_list) {
        arr.push("#" + rgb + "FF");
    }
    return arr;
}

@Injectable()
export class ColorService {
    flatColors:string[] = rgb2rgba([
        "FFFFFF", "C0C0C0", "808080", "000000", "FF0000", "800000", "FFFF00",
        "808000", "00FF00", "00FF00", "00FFFF", "008080", "0000FF", "000080", "FF00FF",
        "800080"
    ]);
    constructor() {}

    addColor(colorValue) {
        if(this.flatColors.indexOf(colorValue)>=0) return;
        this.flatColors.push(colorValue);
        this.flatColors = this.flatColors.splice(0, 20)
    }

}
