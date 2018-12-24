/**
 * Coordinates of Position for `PointF`.
 * @private
 */
export class PointF {
    /**
     * Value of `X`.
     * @private
     */
    public x : number;
    /**
     * Value of `Y`.
     * @private
     */
    public y : number;
    //public static readonly empty : PointF = new PointF(0, 0);
    /**
     * Instance of `PointF` class.
     * @private
     */
    constructor()
    /**
     * Instance of `PointF` class with X, Y co-ordinates.
     * @private
     */
    constructor(x : number, y : number)
    constructor(x? : number, y? : number) {
        if (typeof x === 'undefined') {
            this.x = 0;
            this.y = 0;
        } else {
            if (x !== null) {
                this.x = x;
            } else {
                this.x = 0;
            }
            if (y !== null) {
                this.y = y;
            } else {
                this.y = 0;
            }
        }
    }
}
/**
 * Width and Height as `Size`.
 * @private
 */
export class SizeF {
    /**
     * Value of ``Height``.
     * @private
     */
    public height : number;
    /**
     * Value of `Width`.
     * @private
     */
    public width : number;
    //public static readonly empty : SizeF = new SizeF(0, 0);
    /**
     * Instance of `SizeF` class.
     * @private
     */
    constructor()
    /**
     * Instance of `SizeF` class with Width and Height.
     * @private
     */
    constructor(width : number, height : number)
    constructor(width? : number, height? : number) {
        if (typeof height === 'undefined') {
            this.height = 0;
            this.width = 0;
        } else {
            if (height !== null) {
                this.height = height;
            } else {
                this.height = 0;
            }
            if (width !== null) {
                this.width = width;
            } else {
                this.width = 0;
            }
        }
    }
}
/**
 * `RectangleF` with Position and size.
 * @private
 */
export class RectangleF {
    /**
     * Value of `X`.
     * @private
     */
    public x : number;
    /**
     * Value of `Y`.
     * @private
     */
    public y : number;
    /**
     * Value of `Height`.
     * @private
     */
    public height : number;
    /**
     * Value of `Width`.
     * @private
     */
    public width : number;
    /**
     * Instance of `RectangleF` class.
     * @private
     */
    public constructor()
    /**
     * Instance of `RectangleF` class with X, Y, Width and Height.
     * @private
     */
    public constructor(x : number, y : number, height : number, width : number)
    /**
     * Instance of `RectangleF` class with PointF, SizeF.
     * @private
     */
    public constructor(pointF : PointF, sizeF : SizeF)
    public constructor(arg1? : PointF | number, arg2? : SizeF | number, arg3 ?: number, arg4 ?: number ) {
        if (typeof arg1 === typeof arg1 && typeof arg1 === 'undefined') {
            this.x = 0;
            this.y = 0;
            this.height = 0;
            this.width = 0;
        } else {
            if (arg1 instanceof PointF && arg2 instanceof SizeF && typeof arg3 === 'undefined') {
                let pointf : PointF = arg1 as PointF;
                this.x = pointf.x;
                this.y = pointf.y;
                let sizef : SizeF = arg2 as SizeF;
                this.height = sizef.height;
                this.width = sizef.width;
            } else {
                let x : number = arg1 as number;
                let y : number = arg2 as number;
                let width : number = arg3 as number;
                let height : number = arg4 as number;
                this.x = x;
                this.y = y;
                this.height = height;
                this.width = width;
            }
        }
    }
}
/**
 * `Rectangle` with left, right, top and bottom.
 * @private
 */
export class Rectangle {
    /**
     * Value of `left`.
     * @private
     */
    public left : number;
    /**
     * Value of `top`.
     * @private
     */
    public top : number;
    /**
     * Value of `right`.
     * @private
     */
    public right : number;
    /**
     * Value of `bottom`.
     * @private
     */
    public bottom : number;
    /**
     * Instance of `RectangleF` class with X, Y, Width and Height.
     * @private
     */
    public constructor(left : number, top : number, right : number, bottom : number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    /**
     * Gets a value of width
     */
    public get width() : number {
        return this.right - this.left;
    }
    /**
     * Gets a value of height
     */
    public get height() : number {
        return this.bottom - this.top;
    }
    /**
     * Gets a value of Top and Left
     */
    public get topLeft() : PointF {
        return new PointF(this.left, this.top);
    }
    /**
     * Gets a value of size
     */
    public get size() : SizeF {
        return new SizeF(this.width, this.height);
    }
    public toString() : string {
        return this.topLeft + 'x' + this.size;
    }
}