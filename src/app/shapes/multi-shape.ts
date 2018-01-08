import { Shape } from './shape';
import { RectangleShape } from './rectangle-shape';
import { OvalShape } from './oval-shape';
import { PolygonShape } from './polygon-shape';
import { CurveShape } from './curve-shape';
import { CurveJoinerShape } from './curve-joiner-shape';
import { MimicShape } from './mimic-shape';
import { ImageShape } from './image-shape';
import { VideoShape } from './video-shape';
import { TextShape } from './text-shape';
import { Color, copyObject, Point, extendCtx } from '../commons';

export class MultiShape extends Shape {
    static TypeName = "multi_shape";
    shapes:Shape[] = []
    masked: boolean = false;

    static create(width=1, height=1):MultiShape {
        return new MultiShape(new Point(0,0), null, null, width, height);
    }

    static
    getShapeFromJson(shapeData):Shape {
        let shape:Shape;
        switch(shapeData.type) {
            case MultiShape.TypeName:
                shape = MultiShape.createFromJson(shapeData);
                break;
            case RectangleShape.TypeName:
                shape = RectangleShape.createFromJson(shapeData);
                break;
            case OvalShape.TypeName:
                shape = OvalShape.createFromJson(shapeData);
                break;
            case PolygonShape.TypeName:
                shape = PolygonShape.createFromJson(shapeData);
                break;
            case CurveShape.TypeName:
                shape = CurveShape.createFromJson(shapeData);
                break;
            case TextShape.TypeName:
                shape = TextShape.createFromJson(shapeData);
                break;
        }
        return shape;
    }

    static createFromJson(jsonData) {
        let newOb = new MultiShape(null, null, null, 0, 0);
        newOb.copyFromJson(jsonData);
        newOb.masked = (jsonData.masked == "True");

        let shapes = jsonData.shape;
        if (!(shapes instanceof Array)) {
            shapes = [ shapes ] ;
        }
        for(let shapeData of shapes) {
            let shape:Shape = MultiShape.getShapeFromJson(shapeData);
            if (shape) {
                newOb.addShape(shape);
            }
        }
        return newOb;
    }

    getTypeName() {
        return MultiShape.TypeName;
    }

    toJsonOb() {
        let jsonOb:any = super.toJsonOb();
        if (jsonOb.masked) {
            jsonOb.masked = "True";
        }
        if (this.shapes.length>1) {
            jsonOb.shape = [];
            for(let shape of this.shapes) {
                jsonOb.shape.push(shape.toJsonOb());
            }
        } else {
            jsonOb.shape = this.shapes[0].toJsonOb();
        }
        return jsonOb;
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
            if (!drawingSize) {
                drawingSize = new Point(shape.width, shape.height);
            }
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
                maskedCtx = extendCtx(maskedCanvas.getContext("2d"));
                origCtx = ctx;
                ctx = maskedCtx;
                maskedCtx.setTransMatrix(origCtx.getTransMatrix());
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
                if (!lastShape.hasFill()) {
                    maskingCanvas = document.createElement("canvas");
                    maskingCanvas.width = drawingSize.x;
                    maskingCanvas.height = drawingSize.y;
                    maskingCtx = extendCtx(maskingCanvas.getContext("2d"));
                    MultiShape.drawShape(lastShape, maskingCtx, drawingSize,
                            fixedBorder, rootShape, displayNonRenderable);
                }

                if (!maskingCanvas) {
                    ctx.save();
                    ctx.save()
                    lastShape.preDraw(ctx, rootShape);
                    lastShape.drawPath(ctx);
                    ctx.restore();
                    ctx.clip();
                    ctx.drawImage(maskedCanvas, 0, 0);
                    ctx.restore();
                } else {
                    ctx.save();
                    maskingCtx.globalCompositeOperation = "source-in";
                    maskingCtx.drawImage(maskedCanvas, 0, 0);
                    ctx.drawImage(maskingCanvas, 0, 0);
                    ctx.restore();
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
