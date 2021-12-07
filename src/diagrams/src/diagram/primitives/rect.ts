import { PointModel } from './point-model';

/**
 * Rect defines and processes rectangular regions
 */
export class Rect {
    /**
     * Sets the x-coordinate of the starting point of a rectangular region
     *
     * @default 0
     */
    public x: number = Number.MAX_VALUE;

    /**
     * Sets the y-coordinate of the starting point of a rectangular region
     *
     * @default 0
     */
    public y: number = Number.MAX_VALUE;

    /**
     * Sets the width of a rectangular region
     *
     * @default 0
     */
    public width: number = 0;

    /**
     * Sets the height of a rectangular region
     *
     * @default 0
     */
    public height: number = 0;

    constructor(x?: number, y?: number, width?: number, height?: number) {
        if (x === undefined || y === undefined) {
            x = y = Number.MAX_VALUE;
            width = height = 0;
        } else {
            if (width === undefined) {
                width = 0;
            }
            if (height === undefined) {
                height = 0;
            }
        }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**   @private  */
    public static empty: Rect = new Rect(Number.MAX_VALUE, Number.MIN_VALUE, 0, 0);
    // eslint-disable-next-line jsdoc/require-returns
    /**   @private  */
    public get left(): number {
        return this.x;
    }
    /**
     * right method \
     *
     * @returns { Rect } right method .\
     *
     * @private
     */
    public get right(): number {
        return this.x + this.width;
    }
    /**
     * toBounds method \
     *
     * @returns { Rect } toBounds method .\
     *
     * @private
     */
    public get top(): number {
        return this.y;
    }
    /**
     * bottom method \
     *
     * @returns { Rect } bottom method .\
     *
     * @private
     */
    public get bottom(): number {
        return this.y + this.height;
    }
    /**
     * topLeft method \
     *
     * @returns { Rect } topLeft method .\
     *
     * @private
     */
    public get topLeft(): PointModel {
        return { x: this.left, y: this.top };
    }
    /**
     * topRight method \
     *
     * @returns { Rect } topRight method .\
     *
     * @private
     */
    public get topRight(): PointModel {
        return { x: this.right, y: this.top };
    }
    /**
     * bottomLeft method \
     *
     * @returns { Rect } bottomLeft method .\
     *
     * @private
     */
    public get bottomLeft(): PointModel {
        return { x: this.left, y: this.bottom };
    }
    /**
     * bottomRight method \
     *
     * @returns { Rect } bottomRight method .\
     *
     * @private
     */
    public get bottomRight(): PointModel {
        return { x: this.right, y: this.bottom };
    }
    /**
     * middleLeft method \
     *
     * @returns { Rect } middleLeft method .\
     *
     * @private
     */
    public get middleLeft(): PointModel {
        return { x: this.left, y: this.y + this.height / 2 };
    }
    /**
     * middleRight method \
     *
     * @returns { Rect } middleRight method .\
     *
     * @private
     */
    public get middleRight(): PointModel {
        return { x: this.right, y: this.y + this.height / 2 };
    }
    /**
     * topCenter method \
     *
     * @returns { Rect } topCenter method .\
     *
     * @private
     */
    public get topCenter(): PointModel {
        return { x: this.x + this.width / 2, y: this.top };
    }
    /**
     * bottomCenter method \
     *
     * @returns { Rect } bottomCenter method .\
     *
     * @private
     */
    public get bottomCenter(): PointModel {
        return { x: this.x + this.width / 2, y: this.bottom };
    }
    /**
     * center method \
     *
     * @returns { PointModel } center method .\
     *
     * @private
     */
    public get center(): PointModel {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }
    /**
     * equals method \
     *
     * @returns { boolean } equals method .\
     * @param {Rect} rect1 - provide the rect1 value.
     * @param {Rect} rect2 - provide the rect2 value.
     *
     * @private
     */
    public equals(rect1: Rect, rect2: Rect): boolean {
        return rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height;
    }
    /**
     * uniteRect method \
     *
     * @returns { Rect } uniteRect method .\
     * @param {Rect} rect - provide the points value.
     *
     * @private
     */
    public uniteRect(rect: Rect): Rect {
        const right: number = Math.max(Number.NaN === this.right || this.x === Number.MAX_VALUE ? rect.right : this.right, rect.right);
        const bottom: number = Math.max(Number.NaN === this.bottom || this.y === Number.MAX_VALUE ? rect.bottom : this.bottom, rect.bottom);
        this.x = Math.min(this.left, rect.left);
        this.y = Math.min(this.top, rect.top);
        this.width = right - this.x;
        this.height = bottom - this.y;
        return this;
    }
    /**
     * unitePoint method \
     *
     * @returns { void } unitePoint method .\
     * @param {PointModel} point - provide the points value.
     *
     * @private
     */
    public unitePoint(point: PointModel): void {
        if (this.x === Number.MAX_VALUE) {
            this.x = point.x;
            this.y = point.y;
            return;
        }
        const x: number = Math.min(this.left, point.x);
        const y: number = Math.min(this.top, point.y);
        const right: number = Math.max(this.right, point.x);
        const bottom: number = Math.max(this.bottom, point.y);
        this.x = x;
        this.y = y;
        this.width = right - this.x;
        this.height = bottom - this.y;
    }

    // public intersection(rect: Rect): Rect {
    //     if (this.intersects(rect)) {
    //         let left: number = Math.max(this.left, rect.left);
    //         let top: number = Math.max(this.top, rect.top);
    //         let right: number = Math.min(this.right, rect.right);
    //         let bottom: number = Math.min(this.bottom, rect.bottom);
    //         return new Rect(left, top, right - left, bottom - top);
    //     }
    //     return Rect.empty;
    // }
    /**
     * Inflate method \
     *
     * @returns { Rect } Inflate method .\
     * @param {number} padding - provide the points value.
     *
     * @private
     */
    public Inflate(padding: number): Rect {
        this.x -= padding;
        this.y -= padding;
        this.width += padding * 2;
        this.height += padding * 2;
        return this;
    }
    //public Inflate(size: Size): Rect {
    //    this.x -= size.Width;
    //    this.y -= size.Height;
    //    this.width += size.Width * 2;
    //    this.height += size.Height * 2;
    //    return this;
    //}
    // public inflate(width: number, height: number): void {
    //     this.x -= width;
    //     this.y -= height;
    //     this.width += width * 2;
    //     this.height += height * 2;
    // }
    /**
     * intersects method \
     *
     * @returns { boolean } intersects method .\
     * @param {Rect} rect - provide the points value.
     *
     * @private
     */
    public intersects(rect: Rect): boolean {
        if (this.right < rect.left || this.left > rect.right || this.top > rect.bottom || this.bottom < rect.top) {
            return false;
        }
        return true;
    }
    /**
     * containsRect method \
     *
     * @returns { boolean } containsRect method .\
     * @param {Rect} rect - provide the points value.
     *
     * @private
     */
    public containsRect(rect: Rect): boolean {
        return this.left <= rect.left && this.right >= rect.right && this.top <= rect.top && this.bottom >= rect.bottom;
    }
    /**
     * containsPoint method \
     *
     * @returns { boolean } containsPoint method .\
     * @param {PointModel} point - provide the points value.
     * @param {number} padding - provide the padding value.
     *
     * @private
     */
    public containsPoint(point: PointModel, padding: number = 0): boolean {
        return this.left - padding <= point.x && this.right + padding >= point.x
            && this.top - padding <= point.y && this.bottom + padding >= point.y;
    }
    // public toPoints(): PointModel[] {
    //     let points: PointModel[] = [];
    //     points.push(this.topLeft);
    //     points.push(this.topRight);
    //     points.push(this.bottomLeft);
    //     points.push(this.bottomRight);
    //     return points;
    // }
    /**
     * toBounds method \
     *
     * @returns { Rect } toBounds method .\
     * @param {PointModel[]} points - provide the points value.
     *
     * @private
     */
    public static toBounds(points: PointModel[]): Rect {
        const rect: Rect = new Rect();
        for (const pt of points) {
            rect.unitePoint(pt);
        }
        return rect;
    }
    // public scale(scaleX: number, scaleY: number): void {
    //     this.width *= scaleX;
    //     this.height *= scaleY;
    // }
    // public offset(offsetX: number, offsetY: number): void {
    //     this.x += offsetX;
    //     this.y += offsetY;
    // }
}
