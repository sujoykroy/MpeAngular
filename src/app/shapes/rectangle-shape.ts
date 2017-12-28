import { Shape } from './shape'
import { Color, copyObject, Point } from '../commons'

export class RectangleShape extends Shape {
    corner: number;

    constructor(
        anchorAt:Point, borderColor:Color, fillColor:Color,
        width:number, height: number, corner:number) {
        super(anchorAt, borderColor, fillColor, width, height);
        this.corner = corner;
    }
}
