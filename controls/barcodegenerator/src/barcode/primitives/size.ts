/**
 * Size defines and processes the size(width/height) of the objects
 */
export class Size {

    /**
     * Sets the height of an object

     */
    public height: number;

    /**
     * Sets the width of an object

     */
    public width: number;

    constructor(width?: number, height?: number) {
        this.width = width;
        this.height = height;
    }
}