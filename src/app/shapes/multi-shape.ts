import { Shape } from './shape';
import { RectangleShape } from './rectangle-shape';
import { PolygonShape } from './polygon-shape';
import { CurveShape } from './curve-shape';
import { CurveJoinerShape } from './curve-joiner-shape';
import { MimicShape } from './mimic-shape';
import { ImageShape } from './image-shape';
import { VideoShape } from './video-shape';
import { TextShape } from './text-shape';
import { Color, copyObject, Point } from '../commons';

export class MultiShape extends Shape {
    shapes:Shape[] = []
    masked: boolean = false;

    static create(width=1, height=1):MultiShape {
        return new MultiShape(new Point(0,0), null, null, width, height);
    }

    static createFromJson(jsonData) {
        let newOb = new MultiShape(null, null, null, 0, 0);
        newOb.copyFromJson(jsonData);
        let shape:Shape;
        for(let shapeData of jsonData.shape) {
            shape = null;
            switch(shapeData.type) {
                case 'multi_shape':
                    shape = MultiShape.createFromJson(shapeData);
                    break;
                case "rectangle":
                    shape = RectangleShape.createFromJson(shapeData);
                    break;
                case "polygon_shape":
                    shape = PolygonShape.createFromJson(shapeData);
                    break;
                case "curve_shape":
                    shape = CurveShape.createFromJson(shapeData);
                    break;
            }
            if (shape) {
                newOb.addShape(shape);
            }
        }
        return newOb;
    }

    copy(deepCopy:boolean = false):Shape {
        let newOb = new MultiShape(
            this.anchorAt, this.borderColor, this.fillColor, this.width, this.height);
        this.copyInto(newOb);
        for (let shape of this.shapes) {
            if (deepCopy) {
                shape = shape.copy(deepCopy);
                this.addShape(shape);
            } else {
                newOb.shapes.push(shape);
            }
        }
        return newOb;
    }

    addShape(shape:Shape) {
        this.shapes.push(shape);
        shape.setParentShape(this);
    }

    static drawShape(shape, ctx, drawingSize=null,
                                 fixedBorder=true, rootShape=null, showNonRenderable=false) {
        if (shape instanceof MultiShape) {
            let multiShape = shape;
            if (multiShape.hasFill()) {
                ctx.save()
                multiShape.preDraw(ctx, rootShape);
                multiShape.drawPath(ctx);
                multiShape.drawFill(ctx);
                ctx.restore();
            }
            let renderableShapesCount = multiShape.shapes.length;

            let maskedCanvas = null;
            let maskedCtx = null;
            let origCtx = null;

            if (multiShape.masked && multiShape.shapes.length>1) {
                renderableShapesCount -= 1;
                maskedCanvas = document.createElement("canvas");
                maskedCanvas.width = drawingSize.x;
                maskedCanvas.height = drawingSize.y;
                maskedCtx = maskedCanvas.getContext("2d");
                origCtx = ctx;
                ctx = maskedCtx;
            }

            let lastShape = null;
            if (multiShape.shapes.length>0) {
                lastShape = multiShape.shapes[multiShape.shapes.length-1];
            }

            let displayNonRenderable;
            for (let i=0; i<renderableShapesCount; i++) {
                let childShape = multiShape.shapes[i];

                if (!childShape.visible) continue;
                if (!childShape.renderable && !showNonRenderable) continue;
                if (childShape instanceof MultiShape) {
                    displayNonRenderable = false;
                } else {
                    displayNonRenderable = showNonRenderable;
                }
                MultiShape.drawShape(childShape, ctx, drawingSize,
                            fixedBorder, rootShape, displayNonRenderable);
            }
            if (maskedCanvas) {
                let lastShape = multiShape.shapes[multiShape.shapes.length-1];
                ctx = origCtx;
                let maskingCanvas;
                let maskingCtx;
                if (lastShape.hasFill()) {
                    maskingCanvas = document.createElement("canvas");
                    maskingCanvas.width = drawingSize.x;
                    maskingCanvas.height = drawingSize.y;
                    maskingCtx = maskingCanvas.getContext("2d");
                    MultiShape.drawShape(lastShape, maskingCtx, drawingSize,
                            fixedBorder, rootShape, displayNonRenderable);
                }

                if (!maskingCanvas) {
                    ctx.save()
                    lastShape.preDraw(ctx, rootShape);
                    lastShape.drawPath(ctx);
                    ctx.clip();
                    ctx.drawImage(maskedCanvas);
                    ctx.restore();
                } else {
                    maskingCtx.globalCompositeOperation = "source-in";
                    maskingCtx.drawImage(maskedCanvas);
                    ctx.drawImage(maskingCanvas);
                }

                if (lastShape.renderable || showNonRenderable) {
                    ctx.save();
                    lastShape.preDraw(ctx, rootShape);
                    lastShape.drawPath(ctx);
                    if (fixedBorder) {
                        ctx.restore();
                        lastShape.drawBorder(ctx);
                    } else {
                        lastShape.drawBorder(ctx);
                        ctx.restore();
                    }
                }
            }
            if (multiShape.hasBorder()) {
                ctx.save()
                multiShape.preDraw(ctx, rootShape);
                multiShape.drawPath(ctx);
                if (fixedBorder) {
                    ctx.restore();
                    multiShape.drawBorder(ctx);
                } else {
                    multiShape.drawBorder(ctx);
                    ctx.restore()
                }
            }
        } else if (shape instanceof CurveJoinerShape) {
            shape.draw(ctx, rootShape, fixedBorder);
        } else if (shape instanceof MimicShape) {
            if (shape.mimicLikeShape) {
                MultiShape.drawShape(shape.mimicLikeShape, ctx,
                            drawingSize, fixedBorder, rootShape, false);
            }
        } else {
            ctx.save()
            shape.preDraw(ctx, rootShape);
            shape.drawPath(ctx);
            shape.drawFill(ctx);
            ctx.restore();

            if (shape instanceof ImageShape || shape instanceof VideoShape) {
                ctx.save()
                shape.preDraw(ctx, rootShape);
                shape.drawImage(ctx, rootShape);
                ctx.restore();
            }
            if (shape instanceof TextShape) {
                ctx.save();
                shape.preDraw(ctx, rootShape);
                shape.drawPath(ctx);
                shape.drawText(ctx);
                ctx.restore();
            }
            ctx.save()
            shape.preDraw(ctx, rootShape);
            shape.drawPath(ctx);
            if (fixedBorder) {
                ctx.restore();
                shape.drawBorder(ctx);
            } else {
                shape.drawBorder(ctx);
                ctx.restore();
            }
        }
    }

    draw(ctx, drawingSize=null, fixedBorder=true, rootShape=null, showNonRenderable=false) {
        MultiShape.drawShape(this, ctx, drawingSize, fixedBorder, rootShape, showNonRenderable); 
    }
}
