
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
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


}
