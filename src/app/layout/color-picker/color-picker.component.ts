import { Component, OnInit, Inject } from '@angular/core';
import { ColorService } from '../../misc/color.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { hsv2rgb, rgb2hsv } from '../../commons/color-utils';
import { Color } from '../../commons';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {
    colorOb: Color;
    _flatColor:string = "#ffffff";

    set flatColor(value) {
        this._flatColor = value;
        this.colorOb = Color.createFromHtml(this._flatColor);
    }

    get flatColor() {
        return this._flatColor;
    }

    hsvColor:number[] = [0, 0, 0]

    set hue(value) {
        this.hsvColor[0] = value;
        this._computeRgbColor();
    }
    get hue() {
        return this.hsvColor[0];
    }

    set saturation(value) {
        this.hsvColor[1] = value;
        this._computeRgbColor();
    }
    get saturation() {
        return this.hsvColor[1];
    }

    set value(value) {
        this.hsvColor[2] = value;
        this._computeRgbColor();
    }
    get value() {
        return this.hsvColor[2];
    }

    set alpha(value) {
        this.colorOb.alpha = value;
        this.flatColor = this.colorOb.toHtml();
    }
    get alpha() {
        return this.colorOb.alpha;
    }

    _computeRgbColor() {
        let rgbColor = hsv2rgb(this.hsvColor[0], this.hsvColor[1], this.hsvColor[2]);
        this.colorOb.red = rgbColor[0];
        this.colorOb.green = rgbColor[1];
        this.colorOb.blue = rgbColor[2];
        this.flatColor = this.colorOb.toHtml();
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public colorService:ColorService,
                public dialogRef: MatDialogRef<ColorPickerComponent>,
                private dialog:MatDialog) {
        this.flatColor = this.data.flatColor;
        this.hsvColor = rgb2hsv(this.colorOb.red, this.colorOb.green, this.colorOb.blue);
    }

    ngOnInit() {}

    onFlatColorClick(flatColor) {
        this.flatColor = flatColor;
        this.dialogRef.close(flatColor);
    }

    onUseThisColor() {
        this.colorService.addColor(this.flatColor);
        this.dialogRef.close(this.flatColor);
    }
}
