import { PointModel } from './point-model';

/**
 * @hidden
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

    /**   @private  */
    public get left(): number {
        return this.x;
    }
    /**   @private  */
    public get right(): number {
        return this.x + this.width;
    }
    /**   @private  */
    public get top(): number {
        return this.y;
    }
    /**   @private  */
    public get bottom(): number {
        return this.y + this.height;
    }
    /**   @private  */
    public get topLeft(): PointModel {
        return { x: this.left, y: this.top };
    }
    /**   @private  */
    public get topRight(): PointModel {
        return { x: this.right, y: this.top };
    }
    /**   @private  */
    public get bottomLeft(): PointModel {
        return { x: this.left, y: this.bottom };
    }
    /**   @private  */
    public get bottomRight(): PointModel {
        return { x: this.right, y: this.bottom };
    }
    /**   @private  */
    public get middleLeft(): PointModel {
        return { x: this.left, y: this.y + this.height / 2 };
    }
    /**   @private  */
    public get middleRight(): PointModel {
        return { x: this.right, y: this.y + this.height / 2 };
    }
    /**   @private  */
    public get topCenter(): PointModel {
        return { x: this.x + this.width / 2, y: this.top };
    }
    /**   @private  */
    public get bottomCenter(): PointModel {
        return { x: this.x + this.width / 2, y: this.bottom };
    }
    /**   @private  */
    public get center(): PointModel {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }

    /**
     * @param {PointModel} rect1 - rect1
     * @param {number} rect2 - rect2
     * @private
     * @returns {boolean} - boolean
     */
    public equals(rect1: Rect, rect2: Rect): boolean {
        return rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height;
    }

    /**
     * @param {PointModel} rect - rect
     * @private
     * @returns {Rect} - Rect
     */
    public uniteRect(rect: Rect): Rect {
        // eslint-disable-next-line use-isnan
        const right: number = Math.max(Number.NaN === this.right || this.x === Number.MAX_VALUE ? rect.right : this.right, rect.right);
        const bottom: number = this.bottom;
        this.x = Math.min(this.left, rect.left);
        this.y = Math.min(this.top, rect.top);
        this.width = right - this.x;
        this.height = bottom - this.y;
        return this;
    }

    /**
     * @param {PointModel} point - point
     * @private
     * @returns {void} - void
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

    /**
     * @param {Rect} rect - rect
     * @private
     * @returns {Rect} - Rect
     */
    public intersection(rect: Rect): Rect {
        if (this.intersects(rect)) {
            const left: number = Math.max(this.left, rect.left);
            const top: number = Math.max(this.top, rect.top);
            const right: number = Math.min(this.right, rect.right);
            const bottom: number = Math.min(this.bottom, rect.bottom);
            return new Rect(left, top, right - left, bottom - top);
        }
        return Rect.empty;
    }
    /**
     * @param {number} padding - padding
     * @private
     * @returns {Rect} - Rect
     */
    public Inflate(padding: number): Rect {
        this.x -= padding;
        this.y -= padding;
        this.width += padding * 2;
        this.height += padding * 2;
        return this;
    }
    // public Inflate(size: Size): Rect {
    //    this.x -= size.Width;
    //    this.y -= size.Height;
    //    this.width += size.Width * 2;
    //    this.height += size.Height * 2;
    //    return this;
    // }
    // public inflate(width: number, height: number): void {
    //     this.x -= width;
    //     this.y -= height;
    //     this.width += width * 2;
    //     this.height += height * 2;
    // }
    /**
     * @param {Rect} rect - rect
     * @private
     * @returns {boolean} - boolean
     */
    public intersects(rect: Rect): boolean {
        if (this.right < rect.left || this.left > rect.right || this.top > rect.bottom || this.bottom < rect.top) {
            return false;
        }
        return true;
    }
    /**
     * @param {Rect} rect - rect
     * @private
     * @returns {boolean} - boolean
     */
    public containsRect(rect: Rect): boolean {
        return this.left <= rect.left && this.right >= rect.right && this.top <= rect.top && this.bottom >= rect.bottom;
    }
    /**
     * @param {PointModel} point - point
     * @param {PointModel} padding - padding
     * @private
     * @returns {boolean} - boolean
     */
    public containsPoint(point: PointModel, padding: number = 0): boolean {
        return this.left - padding <= point.x && this.right + padding >= point.x
            && this.top - padding <= point.y && this.bottom + padding >= point.y;
    }
    /**
     * @private
     * @returns {PointModel[]} - PointModel[]
     */
    public toPoints(): PointModel[] {
        const points: PointModel[] = [];
        points.push(this.topLeft);
        points.push(this.topRight);
        points.push(this.bottomLeft);
        points.push(this.bottomRight);
        return points;
    }
    /**
     * @param {PointModel[]} points - points
     * @private
     * @returns {Rect} - Rect
     */
    public static toBounds(points: PointModel[]): Rect {
        const rect: Rect = new Rect();
        for (const pt of points) {
            rect.unitePoint(pt);
        }
        return rect;
    }
    /**
     * @param {number} scaleX - scaleX
     * @param {number} scaleY - scaleY
     * @private
     * @returns {void} - void
     */
    public scale(scaleX: number, scaleY: number): void {
        this.width *= scaleX;
        this.height *= scaleY;
    }
    /**
     * @param {number} offsetX - offsetX
     * @param {number} offsetY - offsetY
     * @private
     * @returns {void} - void
     */
    public offset(offsetX: number, offsetY: number): void {
        this.x += offsetX;
        this.y += offsetY;
    }
}
