import { PointModel } from './point-model';

/**
 * Rect defines and processes rectangular regions
 */
export class Rect {
    /**
     * Sets the x-coordinate of the starting point of a rectangular region
     * @default 0
     */
    public x: number = Number.MAX_VALUE;

    /**
     * Sets the y-coordinate of the starting point of a rectangular region
     * @default 0
     */
    public y: number = Number.MAX_VALUE;

    /**
     * Sets the width of a rectangular region
     * @default 0
     */
    public width: number = 0;

    /**
     * Sets the height of a rectangular region
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
    /**   @private  */
    public equals(rect1: Rect, rect2: Rect): boolean {
        return rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height;
    }
    /**   @private  */
    public uniteRect(rect: Rect): Rect {
        let right: number = Math.max(Number.NaN === this.right || this.x === Number.MAX_VALUE ? rect.right : this.right, rect.right);
        let bottom: number = Math.max(Number.NaN === this.bottom || this.y === Number.MAX_VALUE ? rect.bottom : this.bottom, rect.bottom);
        this.x = Math.min(this.left, rect.left);
        this.y = Math.min(this.top, rect.top);
        this.width = right - this.x;
        this.height = bottom - this.y;
        return this;
    }
    /**   @private  */
    public unitePoint(point: PointModel): void {
        if (this.x === Number.MAX_VALUE) {
            this.x = point.x;
            this.y = point.y;
            return;
        }
        let x: number = Math.min(this.left, point.x);
        let y: number = Math.min(this.top, point.y);
        let right: number = Math.max(this.right, point.x);
        let bottom: number = Math.max(this.bottom, point.y);
        this.x = x;
        this.y = y;
        this.width = right - this.x;
        this.height = bottom - this.y;
    }

    public intersection(rect: Rect): Rect {
        if (this.intersects(rect)) {
            let left: number = Math.max(this.left, rect.left);
            let top: number = Math.max(this.top, rect.top);
            let right: number = Math.min(this.right, rect.right);
            let bottom: number = Math.min(this.bottom, rect.bottom);
            return new Rect(left, top, right - left, bottom - top);
        }
        return Rect.empty;
    }
    /**   @private  */
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
    /**   @private  */
    public intersects(rect: Rect): boolean {
        if (this.right < rect.left || this.left > rect.right || this.top > rect.bottom || this.bottom < rect.top) {
            return false;
        }
        return true;
    }
    /**   @private  */
    public containsRect(rect: Rect): boolean {
        return this.left <= rect.left && this.right >= rect.right && this.top <= rect.top && this.bottom >= rect.bottom;
    }
    /**   @private  */
    public containsPoint(point: PointModel, padding: number = 0): boolean {
        return this.left - padding <= point.x && this.right + padding >= point.x
            && this.top - padding <= point.y && this.bottom + padding >= point.y;
    }
    public toPoints(): PointModel[] {
        let points: PointModel[] = [];
        points.push(this.topLeft);
        points.push(this.topRight);
        points.push(this.bottomLeft);
        points.push(this.bottomRight);
        return points;
    }
    /**   @private  */
    public static toBounds(points: PointModel[]): Rect {
        let rect: Rect = new Rect();
        for (let pt of points) {
            rect.unitePoint(pt);
        }
        return rect;
    }
    public scale(scaleX: number, scaleY: number): void {
        this.width *= scaleX;
        this.height *= scaleY;
    }
    public offset(offsetX: number, offsetY: number): void {
        this.x += offsetX;
        this.y += offsetY;
    }
}