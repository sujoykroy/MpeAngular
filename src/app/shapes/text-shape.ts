import { Shape } from './shape';
import { Color } from '../commons';


export class TextShape extends Shape {
    xAlign:number;
    yAlign:number;
    text:string;
    font:string;
    fontColor: Color

    drawText(ctx) {
    }
}
