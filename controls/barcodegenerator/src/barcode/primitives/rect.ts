
/**
 * Rect defines and processes rectangular regions
 */
export class Rect {
    /**
     * Sets the x-coordinate of the starting point of a rectangular region

     */
    public x: number = Number.MAX_VALUE;

    /**
     * Sets the y-coordinate of the starting point of a rectangular region

     */
    public y: number = Number.MAX_VALUE;

    /**
     * Sets the width of a rectangular region

     */
    public width: number = 0;

    /**
     * Sets the height of a rectangular region

     */
    public height: number = 0;

    constructor(x?: number, y?: number, width?: number, height?: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


}