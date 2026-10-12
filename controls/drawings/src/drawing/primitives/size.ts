/**
 * Size defines and processes the size(width/height) of the objects
 */
export class Size {

    /**
     * Sets the height of an object
     * @default 0
     */
    public height: number;

    /**
     * Sets the width of an object
     * @default 0
     */
    public width: number;

    constructor(width?: number, height?: number) {
        this.width = width;
        this.height = height;
    }

    // /**   @private  */
    // public isEmpty(): boolean {
    //     return this.height === 0 && this.width === 0;
    // }

    /**   @private  */
    public clone(): Size {
        return new Size(this.width, this.height);
    }
}