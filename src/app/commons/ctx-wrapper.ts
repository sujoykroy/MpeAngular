export function extendCtx(ctx) {
    ctx._orig_ctx = ctx;
    ctx._matrices = [new TransMatrix()];
    ctx._getLastMatrix = function() {
        return this._matrices[this._matrices.length-1];
    }
    extendCtxFunction(ctx, "scale", middleCtxScale, 2);
    extendCtxFunction(ctx, "translate", middleCtxTranslate, 2);
    extendCtxFunction(ctx, "save", middleCtxSave, 0);
    extendCtxFunction(ctx, "restore", middleCtxRestore, 0);
    extendCtxFunction(ctx, "save", middleCtxSetTransform, 6);

    ctx.setTransMatrix = function(transMatrix) {
        return middleCtxSetTransMatrix.call(this, transMatrix);
    };

    ctx.getTransMatrix = function() {
        return middleCtxGetTransMatrix.call(this);
    };
    return ctx;
}

class TransMatrix {
    mat:number[][];

    constructor(sx:number=1, sy:number=1,
                dx: number=0, dy:number=0,
                hsx:number=0, hsy:number=0) {
        this.mat = [[sx, hsy, dx], [hsx, sy, dy], [0, 0, 1]];
    }

    copy() {
        let newOb = new TransMatrix();
        for(let i of [0, 1, 2]) {
            for(let j of [0, 1, 2]) {
                newOb.mat[i][j] = this.mat[i][j];
            }
        }
        return newOb;
    }

    copyFrom(other) {
        for(let i of [0, 1, 2]) {
            for(let j of [0, 1, 2]) {
                this.mat[i][j] = other.mat[i][j];
            }
        }
    }

    multiply(other:TransMatrix, inPlace=true) {
        let newOb = new TransMatrix();
        for(let i of [0, 1, 2]) {
            for(let j of [0, 1, 2]) {
                let sum = 0
                for(let k of [0, 1, 2]) {
                    sum += this.mat[i][k]*other.mat[k][j];
                }
                newOb.mat[i][j] = sum;
            }
        }
        if(inPlace) {
            for(let i of [0, 1, 2]) {
                for(let j of [0, 1, 2]) {
                    this.mat[i][j] = newOb.mat[i][j];
                }
            }
            return this;
        } else {
            return newOb;
        }
    }
}

function extendCtxFunction(ctx, functionName, middleFunction, argumentCount) {
    let origFunction = ctx[functionName];
    if (argumentCount==1) {
        ctx[functionName] = function(a1) {
            middleFunction.call(this, a1);
            origFunction.call(this, a1);
        };
    } else if (argumentCount==2) {
        ctx[functionName] = function(a1, a2) {
            middleFunction.call(this, a1, a2);
            origFunction.call(this, a1, a2);
        };
    } else if (argumentCount==3) {
        ctx[functionName] = function(a1, a2, a3) {
            middleFunction.call(this, a1, a2, a3);
            origFunction.call(this, a1, a2, a3);
        };
    } else if (argumentCount==4) {
        ctx[functionName] = function(a1, a2, a3, a4) {
            middleFunction.call(this, a1, a2, a3, a4);
            origFunction.call(this, a1, a2, a3, a4);
        };
    }
}

function middleCtxScale(sx, sy) {
    let tMat = this._getLastMatrix();
    tMat.multiply(new TransMatrix(sx, sy));
}
function middleCtxTranslate(dx, dy) {
    let tMat = this._getLastMatrix();
    tMat.multiply(new TransMatrix(1, 1, dx, dy));
}

function middleCtxSave() {
    this._matrices.push(new TransMatrix());
}

function middleCtxRestore() {
    this._matrices.pop();
}

function middleCtxSetTransform(a, b, c, d, e, f) {
    let tMat = this._getLastMatrix();
    tMat[0][0] = a;
    tMat[0][1] = c;
    tMat[0][2] = e;

    tMat[1][0] = b;
    tMat[1][1] = d;
    tMat[1][2] = f;

    tMat[2][0] = 0;
    tMat[2][1] = 0;
    tMat[2][2] = 1;
}

function middleCtxGetTransMatrix() {
    return this._getLastMatrix().copy();
}

function middleCtxSetTransMatrix(transMatrix) {
    let m = transMatrix.mat;
    this.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
}
